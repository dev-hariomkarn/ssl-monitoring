import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/helpers/token";
import { connectToDB } from "@/lib/mongo";
import User from "@/models/User";
import { checkPassword } from "@/helpers/helpers";

export async function POST(request: NextRequest) {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, {
                status: 400,
            });
        }
        if (user && user.role !== "user") {
            return NextResponse.json({
                message: "Unauthorized User",
            }, {
                status: 400
            });
        }
        const validPassword = await checkPassword(password, user.password);

        if (!validPassword) {
            return NextResponse.json({
                message: "Invalid credentials",
            }, { status: 400 });
        }
        const payload = { id: user._id };
        const token = await createToken(payload)
        const jsonResponse = NextResponse.json({
            token,
            role: user.role,
            email: user.email,
            message: "Logged in successfully",
            success: true
        }, { status: 200 });

        return jsonResponse;
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
        }, { status: 500 });
    }
}