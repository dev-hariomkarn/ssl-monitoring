import { NextResponse } from "next/server";
import * as acme from "acme-client";
import Certificate from "@/models/Certificate";
import AcmeAccount from "@/models/AcmeAccount";
import { connectToDB } from "@/lib/mongo";

export async function POST(req: Request) {
    const { certificateId } = await req.json();
    if (!certificateId) {
        return NextResponse.json({ error: "Missing certificateId" }, { status: 400 });
    }

    await connectToDB();

    const certDoc = await Certificate.findById(certificateId);
    if (!certDoc) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

    if (!certDoc.orderUrl) {
        console.error("No order URL found on certificate document", certDoc);
        return NextResponse.json({ error: "No order URL found" }, { status: 400 });
    }

    // Trim trailing slashes and whitespace to normalize URL
    // const orderUrl = certDoc.orderUrl.trim().replace(/\/+$/, "");
    const orderUrl: any = "https://acme-staging-v02.api.letsencrypt.org/acme/order/231028034/27514967584";

    const acmeAccount = await AcmeAccount.findOne();
    if (!acmeAccount) return NextResponse.json({ error: "ACME account not found" }, { status: 500 });

    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.staging,
        accountKey: acmeAccount.accountKey,
    });

    console.log('client', client)

    if (!acmeAccount.registered) {
        console.log("Registering ACME account...");
        await client.createAccount({
            termsOfServiceAgreed: true,
            contact: ["mailto:developer.hariomkarn@gmail.com"],
        });
        acmeAccount.registered = true;
        await acmeAccount.save();
    }

    try {
        // Fetch order by orderUrl to check status
        const order = await client.getOrder(orderUrl);
        console.log("Order status:", order.status);

        if (order.status !== "ready") {
            console.warn(`Order not ready for finalization. Status: ${order.status}`);
            return NextResponse.json({ error: `Order not ready for finalization. Status: ${order.status}` }, { status: 409 });
        }

        // Finalize order with CSR PEM
        const finalized = await client.finalizeOrder(orderUrl, certDoc.csrPem);
        console.log("Order finalized:", finalized);

        // Fetch certificate PEM from finalized order URL
        const cert = await client.getCertificate(finalized);
        console.log("Certificate retrieved successfully");

        // Save certificate details in DB
        certDoc.certPem = cert;
        certDoc.fullChainPem = cert;
        certDoc.expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90); // 90 days validity
        certDoc.status = "issued";
        await certDoc.save();

        return NextResponse.json({ certificate: cert });
    } catch (err: any) {
        console.error("Error finalizing order:", err);
        certDoc.status = "failed";
        await certDoc.save();
        return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
    }
}
