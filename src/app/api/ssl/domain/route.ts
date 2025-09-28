import { NextResponse } from "next/server";
import * as acme from "acme-client";
import { generatePrivateKey, generateCsr } from "@/helpers/ssl";

let accountKey: string | undefined; // TODO: persist in DB
let accountRegistered = false;

export async function POST(req: Request) {
  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  try {
    if (!accountKey) {
      accountKey = generatePrivateKey();
    }

    const client = new acme.Client({
      directoryUrl: acme.directory.letsencrypt.staging, // ⚠️ staging for test
      accountKey,
    });

    // ✅ Register account once
    if (!accountRegistered) {
      await client.createAccount({
        termsOfServiceAgreed: true,
        contact: ["mailto:developer.hariomkarn@gmail.com"],
      });
      accountRegistered = true;
    }

    const { csrPem, privateKeyPem } = generateCsr(domain);

    const order = await client.createOrder({
      identifiers: [{ type: "dns", value: domain }],
    });

    const authorizations = await client.getAuthorizations(order);

    const challenges = [];
    for (const auth of authorizations) {
      const challenge = auth.challenges.find((c) => c.type === "dns-01");
      if (!challenge) continue;

      const keyAuth = await client.getChallengeKeyAuthorization(challenge);

      challenges.push({
        domain: auth.identifier.value,
        recordName: `_acme-challenge.${auth.identifier.value}`,
        recordValue: keyAuth,
        challengeUrl: challenge.url,
        orderUrl: order.url,
        csrPem,
        privateKeyPem,
      });
    }

    return NextResponse.json({ challenges });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
