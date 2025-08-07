import { connectToDB } from "@/lib/mongo"
import OTP from "@/models/otp"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { email, otp } = reqBody;
        const data = await OTP.findOne({ email })
        return NextResponse.json({
            message: "hello",
            success: true
        }, { status: 200, });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500, });
    }
}