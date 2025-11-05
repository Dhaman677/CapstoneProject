import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  body: string;
  authorId: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

export const PostModel = mongoose.model<IPost>("Post", PostSchema);
