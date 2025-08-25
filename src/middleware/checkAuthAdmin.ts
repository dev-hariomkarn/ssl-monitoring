import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import mongoose from 'mongoose';
import Token from '@/models/token';
import User from '@/models/User';
import { CustomNextRequest } from '@/types/types';

export const checkAuthAdmin = async (req: CustomNextRequest, res: NextResponse) => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        status: false,
        userStatus: false,
        message: 'Access Token is required!',
      }, { status: 401 });
    }

    const bearer = authHeader.split(' ');
    const encryptedTokenableId = bearer[1];

    // Step 1: Decrypt tokenableId
    let tokenableId: string;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedTokenableId, process.env.JWT_SECRET!);
      tokenableId = bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      return NextResponse.json({
        status: false,
        userStatus: false,
        message: 'Failed to decrypt access token.',
      }, { status: 401 });
    }

    // Step 2: Find token record
    const tokenData = await Token.findOne({ tokenableId, tokenableType: 'jwt' });
    if (!tokenData) {
      return NextResponse.json({
        status: false,
        userStatus: false,
        message: 'Access Token is invalid!',
      }, { status: 401 });
    }

    // Step 3: Decrypt JWT
    let decryptedJWT: string;
    try {
      const key = CryptoJS.enc.Hex.parse(tokenData.key);
      const iv = CryptoJS.enc.Hex.parse(tokenData.iv);
      const decrypted = CryptoJS.AES.decrypt(tokenData.token, key, { iv });
      decryptedJWT = decrypted.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      return NextResponse.json({
        status: false,
        userStatus: false,
        message: 'Failed to decrypt JWT.',
      }, { status: 401 });
    }

    // Step 4: Verify JWT
    return new Promise((resolve) => {
      verify(decryptedJWT, process.env.JWT_SECRET!, { issuer: process.env.JWT_ISSUER }, async (err, jwt_payload: any) => {
        if (err) {
          return resolve(NextResponse.json({
            status: false,
            userStatus: false,
            message: err.message,
          }, { status: 401 }));
        }

        try {
          const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(jwt_payload.id),
            role: { $in: ["admin", "superAdmin"] },
            isDeleted: false,
          });

          if (!user) {
            return resolve(NextResponse.json({
              status: false,
              userStatus: false,
              message: 'Admin not found or not authorized!',
            }, { status: 401 }));
          }

          (req as any).token = decryptedJWT;
          (req as any).id = user._id;
          (req as any).role = user.role;

          return resolve(NextResponse.next());

        } catch (userError: any) {
          return resolve(NextResponse.json({
            status: false,
            userStatus: false,
            message: userError.message,
          }, { status: 500 }));
        }
      });
    });

  } catch (err: any) {
    return NextResponse.json({
      status: false,
      userStatus: false,
      message: err.message,
    }, { status: 500 });
  }
};
