import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function POST(req: Request) {
  const { domain, expectedValue } = await req.json();

  if (!domain || !expectedValue) {
    return NextResponse.json({ error: "Domain and expectedValue required" }, { status: 400 });
  }

  try {
    const records = await dns.resolveTxt(`_acme-challenge.${domain}`);
    const flat = records.flat();

    const verified = flat.includes(expectedValue);

    return NextResponse.json({ verified, found: flat });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
