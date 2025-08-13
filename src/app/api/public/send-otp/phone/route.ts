import { randomNumber } from "@/helpers/helpers";
import { sendSms } from "@/helpers/mail";
import { connectToDB } from "@/lib/mongo"
import OTP from "@/models/otp";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { phone } = reqBody;
        const user = await User.findOne({ "phone.value": phone })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }
        const data: any = await OTP.findOneAndUpdate(
            {
                phone: phone,
            },
            {
                phone: phone,
                otp: await randomNumber(),
            },
            { new: true, upsert: true }
        );

        const payload = {
            to: phone,
            body: data.otp
        }

        await sendSms(payload)

        if (data) {
            return NextResponse.json({
                message: "Otp sent successfully",
                success: true,
            }, { status: 200, });
        }
        return NextResponse.json({
            message: "Data not found",
            success: false
        }, { status: 400, });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500, });
    }
}