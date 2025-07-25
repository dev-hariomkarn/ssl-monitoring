import { hashPassword } from "@/helpers/helpers";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is required"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username not available"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already in use"]
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    passwordVerifyToken: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
        type: String,
        enum: [
            "user", "admin" , "superAdmin"
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
            email: `karnhariom122@gmail.com`,
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