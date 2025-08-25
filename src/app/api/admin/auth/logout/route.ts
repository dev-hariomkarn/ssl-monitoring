import { deleteToken } from "@/helpers/token";
import { connectToDB } from "@/lib/mongo";
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin";
import { CustomNextRequest } from "@/types/types";
import { NextResponse } from "next/server";

export const POST = async (req: CustomNextRequest, res: NextResponse) => {
    await connectToDB()
    const adminResponse: any = await checkAuthAdmin(req, res);
    if (adminResponse.status !== 200) {
        console.log('adminResponse', adminResponse)
        return adminResponse;
    }
    try {
        await deleteToken(req.token!)
        return NextResponse.json({
            success: true,
            message: "Logout successfully",
        }, { status: 200 })

    } catch (error: any) {
        console.log('error: ', error);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}