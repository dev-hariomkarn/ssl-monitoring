import { connectToDB } from "@/lib/mongo";
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin";
import Domain from "@/models/domain";
import { CustomNextRequest } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(req: CustomNextRequest, res: NextResponse) {
    await connectToDB();

    // Authenticate admin
    const userResponse: any = await checkAuthAdmin(req, res);
    if (userResponse.status !== 200) {
        return userResponse;
    }

    try {
        // Populate users with name (and email if needed)
        const domains = await Domain.find({}).populate({
            path: "users",
            model: "users",
            select: "name email"
        });

        const domainList = domains.map((domain) => {
            const expiry = new Date(domain.expiryDate);
            const daysLeft = Math.max(
                0,
                Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            );

            return {
                _id: domain._id,
                domain: domain.domain,
                issueDate: domain.issueDate,
                expiryDate: domain.expiryDate,
                status: domain.status,
                daysLeft,
                users: domain.users.map((user: any) => ({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }))
            };
        });

        return NextResponse.json({
            message: "Domain list fetched successfully",
            domains: domainList,
            status: 200,
        });
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            status: 500,
        });
    }
}
