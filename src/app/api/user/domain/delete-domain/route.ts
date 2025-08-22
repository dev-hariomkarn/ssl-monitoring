import { connectToDB } from "@/lib/mongo";
import { checkAuthUser } from "@/middleware/checkAuthUser";
import Domain from "@/models/domain";
import { CustomNextRequest } from "@/types/types";
import { NextResponse } from "next/server";

export async function POST(req: CustomNextRequest, res: NextResponse) {
    await connectToDB();

    // Authenticate user
    const userResponse: any = await checkAuthUser(req, res);
    if (userResponse.status !== 200) {
        return userResponse;
    }
    const userId: any = req.id;

    try {
        const { domainID } = await req.json();
        if (!domainID) {
            return NextResponse.json({
                message: "Domain is required"
            }, { status: 400 });
        }

        const existingDomain = await Domain.findOne({ _id: domainID });
        if (!existingDomain) {
            return NextResponse.json({
                message: "Domain not found",
            }, { status: 404 });
        }

        // Remove user from domain
        if (existingDomain.users.length > 1) {
            existingDomain.users = existingDomain.users.filter(
                (id: any) => id.toString() !== userId.toString()
            );
            await existingDomain.save();
            return NextResponse.json({
                message: "Domain removed successfully",
                domain: existingDomain,
            }, { status: 200 });
        } else {
            // Only this user exists, delete the document
            await Domain.deleteOne({ _id: existingDomain._id });
            return NextResponse.json({
                message: "Domain removed successfully",
            }, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
        }, { status: 500 });
    }
}
