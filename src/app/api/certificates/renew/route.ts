import { NextResponse } from "next/server";
import * as acme from "acme-client";
import Certificate from "@/models/Certificate";
import AcmeAccount from "@/models/AcmeAccount";
import { connectToDB } from "@/lib/mongo";

export async function POST() {
    await connectToDB();

    const acmeAccount = await AcmeAccount.findOne();
    if (!acmeAccount) return NextResponse.json({ error: "ACME account not found" }, { status: 500 });

    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.staging,
        accountKey: acmeAccount.accountKey,
    });

    // get certificates expiring in <30 days
    const soonExpiring = await Certificate.find({
        expiryDate: { $lt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
        status: "issued",
    });

    for (const d of soonExpiring) {
        try {
            const order = await client.createOrder({ identifiers: [{ type: "dns", value: d.domain }] });
            const finalized = await client.finalizeOrder(order, d.csrPem);
            const cert = await client.getCertificate(finalized);

            d.certPem = cert;
            d.fullChainPem = cert;
            d.expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
            d.status = "issued";
            await d.save();
        } catch (err) {
            console.error(`Failed renewal for ${d.domain}`, err);
        }
    }

    return NextResponse.json({ message: "Renewal job completed" });
}
