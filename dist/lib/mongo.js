"use strict";
// lib/mongo.js
// import mongoose from 'mongoose';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
// const MONGO_URI = process.env.MONGO_URI!;
// export const connectToDB = async () => {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(MONGO_URI, {
//     useUnifiedTopology: true,
//   });
// };
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDB = async () => {
    if (mongoose_1.default.connection.readyState === 0) {
        try {
            await mongoose_1.default.connect(process.env.MONGO_URI);
            const connection = await mongoose_1.default.connection;
            connection.on('connected', () => {
                console.log("monogDB Connected");
            });
            connection.on('error', (err) => {
                console.log("Mongo after connection error: ", err);
                process.exit();
            });
        }
        catch (error) {
            console.log("db connection error", error);
        }
    }
};
exports.connectToDB = connectToDB;
