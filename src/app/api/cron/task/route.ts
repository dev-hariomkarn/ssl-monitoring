import { NextResponse } from "next/server";

export async function GET() {
  console.log("Task triggered at:", new Date().toISOString());
  return NextResponse.json({ success: true });5
}