import { connectToDB } from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    await connectToDB()
    try {
        const reqBody = await request.json();
        const { phone, email } = reqBody;
        
        return NextResponse.json({
            message: "Reset link sent Successfully",
            success: true
        }, { status: 200 });

    } catch (error: any) {
        console.log('error', error)
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500, });
    }
};