import { randomToken } from "@/helpers/helpers";
import { sendMail } from "@/helpers/mail";
import { connectToDB } from "@/lib/mongo";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        const user = await User.findOne({ 'email.value': email.toLowerCase() });
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 400 });
        }
        const passwordResetToken = await randomToken();

        user.passwordVerifyToken = passwordResetToken;

        await user.save();

        const payload = {
            to: user?.email,
            title: "Forgot Password",
            data: {
                resetLink: `${process.env.MAIN}reset-password/${passwordResetToken}`,
                name: user.name
            },
            template: "forgot-password"
        };

        await sendMail(payload);

        return NextResponse.json({
            message: "Reset link sent Successfully",
            token: passwordResetToken,
            success: true
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500, });
    }
};