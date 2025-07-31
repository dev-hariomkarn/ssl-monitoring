import { sign } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { randomKeyAndIV, randomString } from "./helpers";
import Token from "@/models/token";

export const createToken = async (payload: Object) => {
  const token = sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
    issuer: process.env.JWT_ISSUER,
  });

  const key = await randomKeyAndIV(64);
  const iv = await randomKeyAndIV(32);
  const tokenableId = await randomString(48);

  const encrypted = CryptoJS.AES.encrypt(token, key, { iv: iv }).toString();
  const data: any = await Token.create({
    tokenableType: "jwt",
    tokenableId: tokenableId,
    name: "bearer",
    token: encrypted,
    key: key,
    iv: iv,
  });
  return CryptoJS.AES.encrypt(
    data.tokenableId,
    `${process.env.JWT_SECRET}`
  ).toString();
};

export const deleteToken = async (token: string) => {
  await Token.deleteMany({ tokenableId: token });
};