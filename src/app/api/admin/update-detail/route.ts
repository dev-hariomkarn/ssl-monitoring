import { connectToDB } from "@/lib/mongo";
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin";
import User from "@/models/User";
import { CustomNextRequest } from "@/types/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req: CustomNextRequest, res: NextResponse) {
    await connectToDB()
    const userResponse: any = await checkAuthAdmin(req, res);
    if (userResponse.status !== 200) {
        return userResponse;
    }

    try {
        const reqBody = await req.json();
        const { name, email, phone } = reqBody;

        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(req.id),
            role: { $in: ["admin", "superAdmin"] },
            isDeleted: false,
        });

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }

        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: req.id } });
            if (emailExists) {
                return NextResponse.json({
                    message: "Email is already in use",
                    status: 400
                });
            }
        }

        if (email !== user.email.value) {
            user.email.isVerified = false
        }

        if (phone !== user.phone.value) {
            user.phone.isVerified = false
        }

        user.name = name || user.name;
        user.email.value = email || user.email.value;
        user.phone.value = phone || user.phone.value;

        await user.save();

        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
        }

        return NextResponse.json({
            message: "Detail updated successfully",
            status: 200,
            user: userData
        });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            status: 500
        });
    }
}