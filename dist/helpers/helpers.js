"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSSL = exports.randomNumber = exports.jwtDecode = exports.createPassword = exports.removeImage = exports.convertUrlToFilePath = exports.minutes = exports.randomToken = exports.randomString = exports.randomKeyAndIV = exports.generateUsername = exports.checkPassword = exports.hashPassword = exports.handleFileUpload = void 0;
const promises_1 = require("fs/promises");
const server_1 = require("next/server");
const bcryptjs_1 = require("bcryptjs");
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = require("jsonwebtoken");
const tls_1 = __importDefault(require("tls"));
const handleFileUpload = async (file, host) => {
    if (file) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const yearFolder = new Date().getFullYear();
            const monthFolder = String(new Date().getMonth() + 1).padStart(2, '0');
            const folderPath = path_1.default.join(process.cwd(), 'public', 'uploads', String(yearFolder), monthFolder);
            fs_1.default.mkdirSync(folderPath, { recursive: true });
            const filePath = path_1.default.join(folderPath, filename);
            await (0, promises_1.writeFile)(filePath, buffer);
            return {
                url: `http://${host}/uploads/${yearFolder}/${monthFolder}/${filename}`,
                type: file.type,
                name: file.name,
                size: file.size
            };
        }
        catch (error) {
            return server_1.NextResponse.json({ Message: "Failed" }, { status: 500 });
        }
    }
};
exports.handleFileUpload = handleFileUpload;
const hashPassword = async (password) => {
    const saltRounds = 15;
    return (0, bcryptjs_1.hashSync)(password, saltRounds);
};
exports.hashPassword = hashPassword;
const checkPassword = async (password, hash) => {
    return (0, bcryptjs_1.compareSync)(password, hash);
};
exports.checkPassword = checkPassword;
const generateUsername = async (email) => {
    const split = email.trim().split("@");
    const username = `${split[0]}_${Date.now()}`;
    return username;
};
exports.generateUsername = generateUsername;
const randomKeyAndIV = async (length) => {
    const str = Array.from({ length: length }, () => "0123456789abcdef".charAt(Math.floor(Math.random() * 16))).join("");
    const key = crypto_js_1.default.enc.Hex.parse(str);
    return key;
};
exports.randomKeyAndIV = randomKeyAndIV;
const randomString = async (length) => {
    const str = Array.from({ length: length }, () => "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(Math.floor(Math.random() * 62))).join("");
    return str;
};
exports.randomString = randomString;
const randomToken = async () => {
    const str = Array.from({ length: 48 }, () => "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(Math.floor(Math.random() * 62))).join("");
    return str;
};
exports.randomToken = randomToken;
const minutes = async (time) => {
    const prevTime = new Date(time).getTime();
    const curnTime = new Date().getTime();
    const minutes = Math.round((curnTime - prevTime) / 1000 / 60);
    return minutes;
};
exports.minutes = minutes;
const convertUrlToFilePath = (url, host) => {
    const hostPattern = new RegExp(`^${host}/`);
    return url.replace(hostPattern, 'public/');
};
exports.convertUrlToFilePath = convertUrlToFilePath;
const removeImage = async (filePath) => {
    try {
        (0, fs_1.unlinkSync)(filePath);
    }
    catch (error) {
        console.log('error: ', error);
    }
};
exports.removeImage = removeImage;
const createPassword = async (name, number) => {
    var _a;
    const fn = (_a = name.split(" ")) === null || _a === void 0 ? void 0 : _a[0];
    const newName = fn.charAt(0).toUpperCase() + fn.slice(1);
    const phone = number.slice(-4);
    return `${newName}@${phone}`;
};
exports.createPassword = createPassword;
const jwtDecode = async (token) => {
    return (0, jsonwebtoken_1.decode)(token);
};
exports.jwtDecode = jwtDecode;
const randomNumber = async () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const num = 100000 + (array[0] % 900000);
    return num;
};
exports.randomNumber = randomNumber;
const checkSSL = async (domain) => {
    const cert = await new Promise((resolve, reject) => {
        const socket = tls_1.default.connect({ host: domain, port: 443, servername: domain, rejectUnauthorized: false }, () => {
            const cert = socket.getPeerCertificate();
            socket.end();
            resolve(cert);
        });
        socket.on('error', reject);
    });
    const issueDate = new Date(cert.valid_from).toISOString().split('T')[0];
    const expiryDate = new Date(cert.valid_to).toISOString().split('T')[0];
    const daysLeft = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const status = daysLeft <= 0 ? 'Expired' : daysLeft <= 7 ? 'Expiring soon' : 'OK';
    const data = { issueDate, expiryDate, daysLeft, status };
    return data;
};
exports.checkSSL = checkSSL;
