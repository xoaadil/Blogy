import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  createdAt: Date;
  postedBy: mongoose.Types.ObjectId;
  likedBy: mongoose.Types.ObjectId[];
  postImage?: string; // Optional field
}

// Create the schema
const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fixed: was Date.now() which executes immediately
  },
  postedBy: {
    type: Schema.Types.ObjectId, // Fixed: use Schema.Types.ObjectId
    ref: "User", // Fixed: use string reference, not the model
    required: true,
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }], // Fixed: properly define array of ObjectIds
  postImage: {
    type: String,
    required: false, // Optional field
  },
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt
});

// Create and export the model
const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;