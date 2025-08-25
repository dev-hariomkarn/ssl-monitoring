"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        set: (value) => value.toLowerCase(),
    },
    phone: {
        type: String,
        trim: true,
    },
    otp: {
        type: Number,
        required: true,
        trim: true,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true, });
const OTP = mongoose_1.models.OTP || (0, mongoose_1.model)("OTP", otpSchema);
exports.default = OTP;
