import { NextResponse } from "next/server";
import * as acme from "acme-client";
import Certificate from "@/models/Certificate";
import AcmeAccount from "@/models/AcmeAccount";
import { generateCsr } from "@/helpers/ssl";
import { connectToDB } from "@/lib/mongo";

export async function POST(req: Request) {
  const { userId, domain } = await req.json();
  await connectToDB();

  if (!userId || !domain)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Get the global ACME account
  const acmeAccount = await AcmeAccount.findOne();
  if (!acmeAccount)
    return NextResponse.json({ error: "ACME account not found" }, { status: 500 });

  // Initialize ACME client
  const client: any = new acme.Client({
    directoryUrl: acme.directory.letsencrypt.staging,
    accountKey: acmeAccount.accountKey,
  });

  // Register account with Let's Encrypt (once)
  if (!acmeAccount.registered) {
    const account: any = await client.createAccount({
      termsOfServiceAgreed: true,
      contact: ["mailto:developer.hariomkarn@gmail.com"],
    });

    // store account URL for future use
    (acmeAccount as any).accountUrl = account.url || undefined;
    acmeAccount.registered = true;
    await acmeAccount.save();
  }

  if (acmeAccount.registered && acmeAccount.accountUrl) {
    client.api.accountUrl = acmeAccount.accountUrl; // this is key
  }

  // Generate CSR and private key
  const { csrPem, privateKeyPem } = generateCsr(domain);

  // Create order & get DNS-01 challenges
  const order = await client.createOrder({ identifiers: [{ type: "dns", value: domain }] });
  const authorizations = await client.getAuthorizations(order);

  const challenges = [];
  for (const auth of authorizations) {
    const challenge = auth.challenges.find((c: any) => c.type === "dns-01");
    if (!challenge) continue;

    const keyAuth = await client.getChallengeKeyAuthorization(challenge);

    challenges.push({
      recordName: `_acme-challenge.${auth.identifier.value}`,
      recordValue: keyAuth,
      challengeUrl: challenge.url,
    });
  }

  // Save certificate document
  const certificateDoc = await Certificate.create({
    user: userId,
    domain,
    orderUrl: order.url,
    privateKeyPem,
    csrPem,
    status: "pending",
  });

  return NextResponse.json({ certificateId: certificateDoc._id, challenges });
}
