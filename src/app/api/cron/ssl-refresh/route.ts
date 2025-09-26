
import { refreshAllDomainsSSL } from "@/helpers/sslCron";
import { NextResponse } from "next/server";

export async function GET() {
  await refreshAllDomainsSSL();
  return NextResponse.json({ message: "SSL refresh triggered" });
}
