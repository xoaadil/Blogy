// types.ts
export interface User {
  _id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  postImage: string;
  postedBy: User;
  likedBy: string[];
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  content: string;
  commentedBy: User;
  onPost: string;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
export interface currentUser {
    _id: string;
    role: string;
    name: string;
  };