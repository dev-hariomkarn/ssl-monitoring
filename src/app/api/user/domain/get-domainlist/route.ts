import { connectToDB } from "@/lib/mongo";
import { checkAuthUser } from "@/middleware/checkAuthUser";
import Domain from "@/models/domain";
import { CustomNextRequest } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(req: CustomNextRequest, res: NextResponse) {
    await connectToDB();

    // Authenticate user
    const userResponse: any = await checkAuthUser(req, res);
    if (userResponse.status !== 200) {
        return userResponse;
    }
    const userId = req.id;

    try {
        // Find all domains where the user is included in the users array
        const domains = await Domain.find({ users: userId }).sort({ createdAt: -1 });

        // Optional: calculate daysLeft dynamically if you want up-to-date info
        const domainList = domains.map((domain) => {
            const expiry = new Date(domain.expiryDate);
            const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            return {
                _id: domain._id,
                domain: domain.domain,
                issueDate: domain.issueDate,
                expiryDate: domain.expiryDate,
                status: domain.status,
                daysLeft,
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
