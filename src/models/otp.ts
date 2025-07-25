import mongoose, { Schema, model, models } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      set: (value: string) => value.toLowerCase(),
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
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  }, { timestamps: true, }
);

const OTP = models.OTP || model("OTP", otpSchema)
export default OTP;