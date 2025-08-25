"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    tokenableType: {
        type: String,
        required: true,
        trim: true,
    },
    tokenableId: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
        required: true,
        trim: true,
    },
    key: {
        type: String,
        required: true,
        trim: true,
    },
    iv: {
        type: String,
        required: true,
        trim: true,
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true, });
const Token = mongoose_1.models.Token || (0, mongoose_1.model)("Token", tokenSchema);
exports.default = Token;
