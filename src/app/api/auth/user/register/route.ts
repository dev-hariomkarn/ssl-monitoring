import { generateUsername, hashPassword } from "@/helpers/helpers";
import { sendMail } from "@/helpers/mail";
import { connectToDB } from "@/lib/mongo";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    await connectToDB()
    try {
        const reqBody = await req.json()
        const { name, email, password } = reqBody
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({
                message: "User already exists!",
                status: 400
            })
        }

        const username: string = await generateUsername(email)

        const hashedPassword = await hashPassword(password)

        const newUser = new User({
            username,
            name,
            email,
            password: hashedPassword
        })

        const savedUSer = await newUser.save()

        const payload = {
            to: email,
            title: "Confirm Your Email",
            data: `${process.env.MAIN}`,
            template: "confirm-email"
        };

        await sendMail(payload);

        return NextResponse.json({
            message: "User regestered successfully!",
            success: true,
            savedUSer
        })

    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: error.message
        })
    }
}