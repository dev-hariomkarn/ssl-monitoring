import { minutes } from "@/helpers/helpers"
import { connectToDB } from "@/lib/mongo"
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin"
import OTP from "@/models/otp"
import User from "@/models/User"
import { CustomNextRequest } from "@/types/types"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export const POST = async (request: CustomNextRequest, response: NextResponse) => {
    await connectToDB()
    const userResponse: any = await checkAuthAdmin(request, response);
    if (userResponse.status !== 200) {
        return userResponse;
    }
    try {
        const reqBody = await request.json();
        const { phone, otp } = reqBody;
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(request.id),
            role: { $in: ["admin", "superAdmin"] },
            isDeleted: false,
        })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
                status: 404
            });
        }
        if (user.phone?.isVerified) {
            return NextResponse.json({
                success: false,
                message: "Phone already verified",
                status: 404
            });
        }
        const data = await OTP.findOne({ phone })
        if (!data) {
            return NextResponse.json({
                message: "Data not found!",
                success: false
            }, { status: 400, });
        }
        const correctOtp = Number(otp) === data.otp
        if (!correctOtp) {
            return NextResponse.json({
                message: "Incorrect OTP",
                success: false
            }, { status: 400, });
        }
        const validTime = await minutes(data.updatedAt) <= 5
        if (!validTime) {
            return NextResponse.json({
                message: "OTP Expired!",
                success: false
            }, { status: 400, });
        }
        await User.findOneAndUpdate(
            { _id: request.id, "phone.value": user.phone.value },
            {
                "phone.isVerified": true,
            },
            { new: true }
        )
        await OTP.findOneAndDelete({ phone: phone })
        return NextResponse.json({
            message: "Code verified successfully",
            success: true
        }, { status: 200, });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500, });
    }
}