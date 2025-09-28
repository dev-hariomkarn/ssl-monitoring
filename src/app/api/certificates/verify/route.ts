import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

async function checkTxt(domain: string, expected: string, retries = 5, delay = 5000): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
        try {
            const records = await dns.resolveTxt(`_acme-challenge.${domain}`);
            const flat = records.flat();
            if (flat.includes(expected)) return true;
        } catch (err: any) {
            console.log("error => ", err)
         }
        await new Promise(r => setTimeout(r, delay));
    }
    return false;
}

export async function POST(req: NextRequest) {
    const { domain, expectedValue } = await req.json();
    if (!domain || !expectedValue) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const verified = await checkTxt(domain, expectedValue);

    return NextResponse.json({ verified });
}