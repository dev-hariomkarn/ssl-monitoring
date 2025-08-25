import { connectToDB } from "@/lib/mongo";
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin";
import User from "@/models/User";
import { CustomNextRequest } from "@/types/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: CustomNextRequest, res: NextResponse) {
    await connectToDB()
    const adminResponse: any = await checkAuthAdmin(req, res);

    if (adminResponse.status !== 200) {
        return adminResponse;
    }
    try {
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(req.id),
            role: { $in: ["admin", "superAdmin"] },
            isDeleted: false,
        })
        if (!user) {
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }
        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,   
            role: user.role,
            profileImage: user.profileImage,
        }
        return NextResponse.json({
            message: "User successfully retrieved",
            status: 200,
            userData: userData
        });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            status: 500
        });
    }
}