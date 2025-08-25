import { hashPassword, minutes } from "@/helpers/helpers";
import { connectToDB } from "@/lib/mongo";
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin";
import User from "@/models/User";
import { CustomNextRequest } from "@/types/types"
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: CustomNextRequest, response: NextResponse) => {
    await connectToDB()
    const adminResponse: any = await checkAuthAdmin(request, response);
    if (adminResponse.status !== 200) {
        return adminResponse;
    }
    try {
        const reqBody = await request.json();
        const { oldPassword, password } = reqBody;
        const user: any = await User.findOne({ _id: request.id })
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 400 });
        }
        const isValidPassword = await compare(oldPassword, user.password);
        if (!isValidPassword) {
            return NextResponse.json({
                message: "Old password is incorrect",
                success: false
            }, { status: 400 });
        }
        const newPassword = await hashPassword(password);
        user.password = newPassword
        await user.save()
        return NextResponse.json({
            message: "Password changed successfull",
            success: true
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            status: 500,
        });
    }

}