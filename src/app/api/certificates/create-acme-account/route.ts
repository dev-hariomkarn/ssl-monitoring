import { generatePrivateKey } from "@/helpers/ssl";
import { connectToDB } from "@/lib/mongo";
import AcmeAccount from "@/models/AcmeAccount";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Check if an ACME account already exists
        const existing = await AcmeAccount.findOne();
        if (existing) {
            return NextResponse.json({
                message: "ACME account already exists",
                success: true,
                accountId: existing._id
            });
        }

        // Generate private key for ACME account
        const accountKey = generatePrivateKey();

        // Create new ACME account in DB
        const newAccount = await AcmeAccount.create({
            accountKey,
            registered: false,
        });

        return NextResponse.json({
            message: "ACME account created",
            success: true,
            accountId: newAccount._id
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({
            message: "Failed to create ACME account",
            error: err.message
        }, { status: 500 });
    }
}
