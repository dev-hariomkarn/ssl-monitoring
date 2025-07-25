import { Schema, model, models } from "mongoose";

const tokenSchema = new Schema(
  {
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
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  }, { timestamps: true, }
);

const Token = models.Token || model("Token", tokenSchema)
export default Token;