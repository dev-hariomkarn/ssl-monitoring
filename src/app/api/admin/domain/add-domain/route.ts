import { checkSSL } from "@/helpers/helpers";
import { connectToDB } from "@/lib/mongo";
import { checkAuthAdmin } from "@/middleware/checkAuthAdmin";
import Domain from "@/models/domain";
import { CustomNextRequest } from "@/types/types";
import { NextResponse } from "next/server";

export async function POST(req: CustomNextRequest, res: NextResponse) {
    await connectToDB();
    const userResponse: any = await checkAuthAdmin(req, res);

    if (userResponse.status !== 200) {
        return userResponse;
    }
    const userId = req.id;

    try {
        const { domain } = await req.json();

        if (!domain) {
            return NextResponse.json({
                message: "Domain is required",
                status: 400
            });
        }

        // Check SSL
        const sslData = await checkSSL(domain);
        if (!sslData) {
            return NextResponse.json({
                message: "SSL certificate not found for the domain",
                status: 404
            });
        }
        // Check if domain already exists
        let existingDomain = await Domain.findOne({ domain });

        if (existingDomain) {
            // Add userId to users array if not already present
            if (!existingDomain.users.includes(userId)) {
                existingDomain.users.push(userId);
                await existingDomain.save();
            }
        } else {
            // Create new domain entry
            existingDomain = await Domain.create({
                domain,
                users: [userId],
                issueDate: sslData.issueDate,
                expiryDate: sslData.expiryDate,
                status: sslData.status,
                daysLeft: sslData.daysLeft
            });
        }

        return NextResponse.json({
            message: "Domain added successfully",
            domain: existingDomain,
            status: 200
        });

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            status: 500
        });
    }
}
