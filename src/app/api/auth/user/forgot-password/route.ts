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

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                status: 400,
            });
        }
        const passwordResetToken = await randomToken();

        user.passwordVerifyToken = passwordResetToken;

        await user.save();

        const payload = {
            to: user?.email,
            title: "Forgot Password",
            data: `${process.env.MAIN}${passwordResetToken}`,
            template: "forgot-password"
        };

        // await sendMail(payload);

        return NextResponse.json({
            message: "Reset link sent Successfully",
            status: 200,
            token: passwordResetToken,
        });

    } catch (error: any) {
        console.log('error', error)
        return NextResponse.json({
            message: error.message,
            status: 500,
        });
    }
};