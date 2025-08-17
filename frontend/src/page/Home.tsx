import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Post, { type postType } from "../components/Post"; // Adjust the import path as needed
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export interface ApiResponse {
  messsage: string;
  AllPosts: postType[];
}

export default function HomePage() {
  const [posts, setPosts] = useState<postType[]>([]);
  const [currentUser, setCurrentUser] = useState<{_id: string, role: string, name: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/post`)
      .then((res) => res.json())
      .then((data: ApiResponse) => setPosts(data.AllPosts))
      .catch(() => toast.error("Failed to load posts"));
  }, []);

  const handleEditPost = async (postId: string, newTitle: string, newContent: string) => {
    try {
      const res = await fetch(`${BASE_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      if (res.ok) {
        setPosts(prev => prev.map(p => 
          p._id === postId 
            ? { ...p, title: newTitle, content: newContent }
            : p
        ));
        toast.success("Post updated successfully!");
      }
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/post/${postId}`, {
        method: "DELETE",
        headers: {
          "token": localStorage.getItem("token") || "",
        },
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        toast.success("Post deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Feed Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Feed</h1>
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-400">{posts.length} stories</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter Options */}
            <select className="bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Latest</option>
              <option>Popular</option>
              <option>Trending</option>
            </select>
            
            <button 
              onClick={() => navigate("/create-post")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
            >
              + New Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              No stories yet. Be the first to share something!
            </p>
            <button 
              onClick={() => navigate("/create-post")}
              className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              Create Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                currentUser={currentUser}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}