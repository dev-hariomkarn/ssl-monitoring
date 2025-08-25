"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_js_1 = __importDefault(require("crypto-js"));
const helpers_1 = require("./helpers");
const token_1 = __importDefault(require("@/models/token"));
const createToken = async (payload) => {
    const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
        issuer: process.env.JWT_ISSUER,
    });
    const key = await (0, helpers_1.randomKeyAndIV)(64);
    const iv = await (0, helpers_1.randomKeyAndIV)(32);
    const tokenableId = await (0, helpers_1.randomString)(48);
    const encrypted = crypto_js_1.default.AES.encrypt(token, key, { iv: iv }).toString();
    const data = await token_1.default.create({
        tokenableType: "jwt",
        tokenableId: tokenableId,
        name: "bearer",
        token: encrypted,
        key: key,
        iv: iv,
    });
    return crypto_js_1.default.AES.encrypt(data.tokenableId, `${process.env.JWT_SECRET}`).toString();
};
exports.createToken = createToken;
const deleteToken = async (token) => {
    await token_1.default.deleteMany({ tokenableId: token });
};
exports.deleteToken = deleteToken;
