import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Post from "../components/Post"

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface userApi {
  name: string;
  bio: string;
  createdAt: Date;
  avatar: string;
}

export interface postApi {
  title: string;
  content: string;
  postImage: string;
  postedBy: {
    _id: string;
    name: string;
    avatar: string;
  };
  _id: string;
  likedBy: [];
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface commentApi {
  _id: string;
  content: string;
  commentedBy: {
    _id: string;
    name: string;
    avatar: string;
  };
  onPost: string;
  updatedAt: Date;
}

export const Profile = () => {
  const [user, setUser] = useState<userApi | null>(null);
  const [comments, setComments] = useState<commentApi[]>([]);
  const [posts, setPosts] = useState<postApi[]>([]);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  // Fetch user info
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${BASE_URL}/user/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => toast.error(err + " Something went wrong"))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch comments
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${BASE_URL}/user/comments/${id}`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => toast.error(err + " Something went wrong"));
  }, [id]);

  // Fetch posts
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${BASE_URL}/user/posts/${id}`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => toast.error(err + " Something went wrong"));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          className="h-20 w-20 rounded-full object-cover"
          src={user?.avatar}
          alt={user?.name}
        />
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-gray-600">{user?.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded ${
            activeTab === "posts" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 rounded ${
            activeTab === "comments" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Comments
        </button>
      </div>

      {/* Content */}
      {activeTab === "posts" ? (
        posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Post
                              key={post._id}
                              post={post}
                              currentUser={currentUser}
                              
                            />
            ))}
          </div>
        ) : (
          <p>No posts yet.</p>
        )
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="text-gray-800">{comment.content}</p>
              <p className="text-sm text-gray-500">
                On post: {comment.onPost}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};
