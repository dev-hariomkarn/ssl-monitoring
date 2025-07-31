import { sendMail } from "@/helpers/mail";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const payload = {
        to: "rcsldev@gmail.com",
        title: "Welness Nine | OTP",
        template: "test"
    }

    await sendMail(payload)

    return NextResponse.json({message: "Send"})
}