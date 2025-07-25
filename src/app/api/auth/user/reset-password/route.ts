import { hashPassword, minutes } from "@/helpers/helpers";
import { connectToDB } from "@/lib/mongo";
import User from "@/models/User";
import { CustomNextRequest } from "@/types/types"
import { NextResponse } from "next/server";

export const POST = async (request: CustomNextRequest) => {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { verifyToken, password } = reqBody;
        const user: any = await User.findOne({ passwordVerifyToken: verifyToken })
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                status: 400
            });
        }
        const isAble = await minutes(user.updatedAt) <= 10
        if (user && !isAble) {
            return NextResponse.json({
                message: "Reset token expired",
                status: 400
            });
        }

        const newPassword = await hashPassword(password);

        user.password = newPassword
        user.passwordVerifyToken = null

        await user.save()

        return NextResponse.json({
            message: "Password reset successfull"
        });
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            status: 500,
        });
    }

}