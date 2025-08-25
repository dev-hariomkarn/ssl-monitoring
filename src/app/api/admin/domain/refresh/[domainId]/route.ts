import { checkSSL } from "@/helpers/helpers";
import { connectToDB } from "@/lib/mongo";
import Domain from "@/models/domain";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { domainId: string } }) {
    await connectToDB();
    try {
        const { domainId } = params;

        const domain = await Domain.findById(domainId);
        if (!domain) {
            return NextResponse.json({
                message: "Domain not found",
            }, { status: 404 });
        }
        // 1. Fetch fresh SSL details
        const sslData = await checkSSL(domain.domain);
        if (!sslData) {
            return NextResponse.json({
                message: "SSL certificate not found for the domain",
                status: 404
            });
        }

        // Update domain SSL info
        const updatedDomain = await Domain.findOneAndUpdate(
            { _id: domainId },
            {
                $set: {
                    issueDate: sslData.issueDate,
                    expiryDate: sslData.expiryDate,
                    daysLeft: sslData.daysLeft,
                    status: sslData.status,
                    lastChecked: new Date(),
                }
            },
            { new: true }
        );

        if (!updatedDomain) {
            return NextResponse.json({
                message: "Domain not found in records",
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "SSL refreshed successfully",
            domain: updatedDomain
        }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
        }, { status: 500 });
    }
}
