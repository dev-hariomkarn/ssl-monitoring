import { hashPassword } from "@/helpers/helpers";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        require: [true, "Name is required"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username not available"]
    },
    email: {
        value: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already in use"],
            set: (value: string) => value.toLowerCase(),
        },
        isVerified: { type: Boolean, default: false, required: true },
    },
    phone: {
        value: {
            type: String
        },
        isVerified: { type: Boolean, required: true, default: false },
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    notification: {
        emailNotification: { type: Boolean, required: true, default: false },
        smsNotification: { type: Boolean, required: true, default: false },
    },
    is2FA: {
        type: Boolean,
        required: true,
        default: false,
    },
    registrationType: {
        type: String,
        required: true,
        enum: [
            "normal",
            "google",
        ],
        default: "normal",
    },
    passwordVerifyToken: { type: String },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
        type: String,
        enum: [
            "user", "admin", "superAdmin"
        ],
        default: "user",
        required: true,
    },
},
    { timestamps: true })

const User = mongoose.models.users || mongoose.model("users", userSchema)

User.exists({
    email: `karnhariom122@gmail.com`,
}).then(async (data) => {
    if (!data) {
        await User.create({
            name: "Super Admin",
            username: "superadmin",
            email: {
                value: `developer.hariomkarn@gmail.com`
            },
            phone: {
                value: "+919157037702",
            },
            isVerified: true,
            password: await hashPassword("Super@1234"),
            role: "superAdmin",
        })
            .then((data) => {
                console.log('data: ', data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

export default User