import { connectToDB } from "@/lib/mongo";
import { checkAuthUser } from "@/middleware/checkAuthUser";
import User from "@/models/User";
import { CustomNextRequest } from "@/types/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: CustomNextRequest, res: NextResponse) {
    await connectToDB()
    const adminResponse: any = await checkAuthUser(req, res);

    if (adminResponse.status !== 200) {
        return adminResponse;
    }
    try {
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(req.id),
            role: "user",
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
            is_verified: user.is_verified,   
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