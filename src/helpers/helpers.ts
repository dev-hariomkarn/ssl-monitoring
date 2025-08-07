import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { compareSync, hashSync } from "bcryptjs";
import path from "path";
import fs, { unlinkSync } from "fs";
import CryptoJS from "crypto-js";
import { decode } from "jsonwebtoken";

export const handleFileUpload = async (file: any, host: string) => {
    if (file) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            const yearFolder = new Date().getFullYear();
            const monthFolder = String(new Date().getMonth() + 1).padStart(2, '0');

            const folderPath = path.join(process.cwd(), 'public', 'uploads', String(yearFolder), monthFolder);

            fs.mkdirSync(folderPath, { recursive: true });

            const filePath = path.join(folderPath, filename);
            await writeFile(filePath, buffer);

            return {
                url: `http://${host}/uploads/${yearFolder}/${monthFolder}/${filename}`,
                type: file.type,
                name: file.name,
                size: file.size
            };
        } catch (error) {

            return NextResponse.json({ Message: "Failed" }, { status: 500 });
        }
    }
};

export const hashPassword = async (password: string) => {
    const saltRounds = 15;
    return hashSync(password, saltRounds);
};

export const checkPassword = async (password: string, hash: string) => {
    return compareSync(password, hash);
};

export const generateUsername = async (email: string) => {
    const split = email.trim().split("@")
    const username = `${split[0]}_${Date.now()}`
    return username
}

export const randomKeyAndIV = async (length: any) => {
    const str = Array.from({ length: length }, () =>
        "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
    ).join("");
    const key = CryptoJS.enc.Hex.parse(str);
    return key;
};

export const randomString = async (length: any) => {
    const str = Array.from({ length: length }, () =>
        "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(
            Math.floor(Math.random() * 62)
        )
    ).join("");

    return str;
};

export const randomToken = async () => {
    const str = Array.from({ length: 48 }, () =>
        "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(
            Math.floor(Math.random() * 62)
        )
    ).join("");
    return str;
};

export const minutes = async (time: string) => {
    const prevTime = new Date(time).getTime();
    const curnTime = new Date().getTime();
    const minutes = Math.round((curnTime - prevTime) / 1000 / 60);
    return minutes;
};

export const convertUrlToFilePath = (url: string, host: string) => {
    const hostPattern = new RegExp(`^${host}/`);
    return url.replace(hostPattern, 'public/');
};

export const removeImage = async (filePath: string) => {
    try {
        unlinkSync(filePath);
    } catch (error) {
        console.log('error: ', error);
    }
};

export const createPassword = async (name: string, number: string) => {
    const fn = name.split(" ")?.[0]
    const newName = fn.charAt(0).toUpperCase() + fn.slice(1);
    const phone = number.slice(-4);
    return `${newName}@${phone}`;
};

export const jwtDecode = async (token: string) => {
    return decode(token);
};

export const randomNumber = async () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const num = 100000 + (array[0] % 900000);
    return num;
};