import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import mongoose from 'mongoose';
import Token from '@/models/token';
import { CustomNextRequest } from '@/types/types';
import User from '@/models/User';

export const checkAuthAdmin = async (req: CustomNextRequest, res: NextResponse) => {
    try {
        const authKey = req.headers.get('authorization');
        if (!authKey) {
            return NextResponse.json({
                status: false,
                userStatus: false,
                message: 'Access Token is required!',
            }, { status: 401 });
        }

        const bearer = authKey.split(' ');
        const bearerToken = bearer[1];

        const tokenData = await Token.findOne({ tokenable_id: bearerToken });

        if (!tokenData) {
            return NextResponse.json({
                status: false,
                userStatus: false,
                message: 'Access Token is invalid!',
            }, { status: 409 });
        }

        const key = CryptoJS.enc.Hex.parse(tokenData.key);
        const iv = CryptoJS.enc.Hex.parse(tokenData.iv);
        const decrypted = CryptoJS.AES.decrypt(tokenData.token, key, { iv: iv });
        const token = decrypted.toString(CryptoJS.enc.Utf8);

        return new Promise((resolve, reject) => {
            verify(token,
                process.env.JWT_SECRET!,
                { issuer: process.env.JWT_ISSUER },
                async (err, jwt_payload: any) => {
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
                            role: "admin",
                            isDeleted: false,
                        });

                        if (!user) {
                            return resolve(NextResponse.json({
                                status: false,
                                userStatus: false,
                                message: 'Access Token is invalid!',
                            }, { status: 401 }));
                        }

                        (req as any).token = bearerToken;
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
                }
            );
        });

    } catch (err: any) {
        return NextResponse.json({
            status: false,
            userStatus: false,
            message: err.message,
        }, { status: 508 });
    }
};