import { sendMail } from "@/helpers/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const payload = {
        to: "karnhariom122@gmail.com",
        title: "Test Mail",
    }

    await sendMail(payload)

    return NextResponse.json({message: "Send"})
}