import { randomNumber } from "@/helpers/helpers";
import { sendMail } from "@/helpers/mail";
import { connectToDB } from "@/lib/mongo"
import OTP from "@/models/otp";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { email } = reqBody;
        const user = await User.findOne({ "email.value": email })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }
        const data: any = await OTP.findOneAndUpdate(
            {
                email: email,
            },
            {
                email: email,
                otp: await randomNumber(),
            },
            { new: true, upsert: true }
        );

        if (data) {
            const mailPayload = {
                to: data.email,
                title: "OTP",
                template: "otp",
                data: {
                    otp: data?.otp,
                    name: user.name,
                    validMin: "10"
                },
            };
            await sendMail(mailPayload)
            return NextResponse.json({
                message: "Otp sent",
                success: true,
                to: data.email,
                title: "OTP",
                data: data?.otp,

            }, { status: 200, });
        }

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500, });
    }
}