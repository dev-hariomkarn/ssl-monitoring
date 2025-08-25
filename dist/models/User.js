"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@/helpers/helpers");
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    profileImage: { type: String, trim: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    username: { type: String, required: [true, "Username is required"], unique: true },
    email: {
        value: { type: String, required: [true, "Email is required"], unique: true, set: (v) => v.toLowerCase() },
        isVerified: { type: Boolean, default: false, required: true },
    },
    phone: { value: { type: String }, isVerified: { type: Boolean, required: true, default: false } },
    isVerified: { type: Boolean, required: true, default: false },
    password: { type: String, required: [true, "Password required"] },
    notification: { emailNotification: { type: Boolean, default: false }, smsNotification: { type: Boolean, default: false } },
    is2FA: { type: Boolean, required: true, default: false },
    registrationType: { type: String, required: true, enum: ["normal", "google"], default: "normal" },
    passwordVerifyToken: { type: String },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["user", "admin", "superAdmin"], default: "user", required: true },
}, { timestamps: true });
const User = mongoose_1.default.models.users || mongoose_1.default.model("users", userSchema);
async function createSuperAdmin() {
    try {
        // Check if superAdmin exists by username or email
        const existing = await User.findOne({
            $or: [
                { username: "superadmin" },
                { "email.value": "developer.hariomkarn@gmail.com" }
            ]
        });
        if (!existing) {
            const superAdmin = await User.create({
                name: "Super Admin",
                username: "superadmin",
                email: { value: "developer.hariomkarn@gmail.com", isVerified: true },
                phone: { value: "+919157037702", isVerified: true },
                isVerified: true,
                password: await (0, helpers_1.hashPassword)("Super@1234"),
                role: "superAdmin",
            });
            console.log("Super Admin created:", superAdmin);
        }
        else {
            console.log("Super Admin already exists:", existing.username);
        }
    }
    catch (err) {
        if (err.code === 11000) {
            console.log("Duplicate key error:", err.keyValue);
        }
        else {
            console.error(err);
        }
    }
}
// Run on app startup
createSuperAdmin();
exports.default = User;
