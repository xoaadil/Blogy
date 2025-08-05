import mongoose, { Document, Types, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  commentedBy: Types.ObjectId;
  onPost: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✅ string name of model
      required: true,
    },
    onPost: {
      type: Schema.Types.ObjectId,
      ref: "Post", // ✅ string name of model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
