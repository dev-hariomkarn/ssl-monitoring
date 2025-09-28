import { NextResponse } from "next/server";
import * as acme from "acme-client";

export async function POST(req: Request) {
    const { accountKey, orderUrl, csrPem } = await req.json();

    if (!accountKey || !orderUrl || !csrPem) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const client = new acme.Client({
            directoryUrl: acme.directory.letsencrypt.staging, // ⚠️ staging for testing
            accountKey,
        });

        // 🔹 Fetch the latest order from Let's Encrypt
        const order = await client.getOrder(orderUrl);

        // 🔹 Finalize with CSR
        const finalizedOrder = await client.finalizeOrder(order, csrPem);

        // 🔹 Get certificate
        const cert = await client.getCertificate(finalizedOrder);

        return NextResponse.json({ certificate: cert });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
