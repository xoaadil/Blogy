import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { 
  Calendar, 
  MessageCircle, 
  FileText, 
  Heart, 
  MapPin,
  Link,
  Settings,
  ArrowLeft,

  Users,

} from "lucide-react";
import CommentWithMenu from "./CommentWithMenu "; // Adjust import path
import Post, { type postType } from "../components/Post"; // Adjust import path

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface userApi {
  name: string;
  bio: string;
  createdAt: Date;
  avatar: string;
  email?: string;
  location?: string;
  website?: string;
  followers?: number;
  following?: number;
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
  const [currentUser, setCurrentUser] = useState<{_id: string, role: string, name: string} | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "likes">("posts");

  // Check if this is current user's profile
  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Fetch user info
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${BASE_URL}/user/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => toast.error( err || "Failed to load user profile"))
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
      .catch((err) => toast.error(err ||"Failed to load comments"));
  }, [id]);

  // Fetch posts
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${BASE_URL}/user/posts/${id}`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => toast.error(err ||"Failed to load posts"));
  }, [id]);

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

  const handleEditComment = async (commentId: string, newContent: string) => {
    // Implementation for editing comments
    try {
      const res = await fetch(`${BASE_URL}/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (res.ok) {
        setComments(prev => prev.map(c => 
          c._id === commentId 
            ? { ...c, content: newContent }
            : c
        ));
        toast.success("Comment updated successfully!");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          "token": localStorage.getItem("token") || "",
        },
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        toast.success("Comment deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalLikes = () => {
    return posts.reduce((total, post) => total + post.likedBy.length, 0);
  };

  const stats = [
    { label: "Posts", value: posts.length, icon: FileText, color: "text-blue-400" },
    { label: "Comments", value: comments.length, icon: MessageCircle, color: "text-green-400" },
    { label: "Likes", value: getTotalLikes(), icon: Heart, color: "text-red-400" },
    { label: "Followers", value: user?.followers || 0, icon: Users, color: "text-purple-400" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          {isOwnProfile && (
            <button className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-700/50 transition-all duration-200">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8 -mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-800 shadow-2xl"
                  src={user?.avatar}
                  alt={user?.name}
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800"></div>
              </div>

              {/* User Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                      {user?.bio || "No bio available"}
                    </p>
                  </div>
                  
                  {!isOwnProfile && (
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105">
                        Follow
                      </button>
                      <button className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium py-2 px-6 rounded-xl border border-slate-600/50 transition-all duration-200">
                        Message
                      </button>
                    </div>
                  )}
                </div>

                {/* User Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}</span>
                  </div>
                  {user?.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user?.website && (
                    <div className="flex items-center space-x-2">
                      <Link className="w-4 h-4" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-slate-700/50 ${stat.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/30 rounded-2xl p-2 mb-8 border border-slate-700/50">
          <div className="flex space-x-2">
            {[
              { key: "posts", label: "Posts", count: posts.length },
              { key: "comments", label: "Comments", count: comments.length },
              { key: "likes", label: "Liked", count: getTotalLikes() }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-xs bg-slate-600/50 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "posts" && (
            <>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Post
                      key={post._id}
                      post={post as postType}
                      currentUser={currentUser}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                  <p className="text-slate-400 mb-6">
                    {isOwnProfile ? "Share your first story with the community!" : `${user?.name} hasn't posted anything yet.`}
                  </p>
                  {isOwnProfile && (
                    <button 
                      onClick={() => navigate("/create-post")}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:scale-105"
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "comments" && (
            <>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentWithMenu
                      key={comment._id}
                      comment={comment}
                      currentUser={currentUser}
                      onEdit={handleEditComment}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No comments yet</h3>
                  <p className="text-slate-400">
                    {isOwnProfile ? "Start engaging with posts to see your comments here!" : `${user?.name} hasn't commented on any posts yet.`}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "likes" && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Liked posts</h3>
              <p className="text-slate-400 mb-6">
                This feature is coming soon! You'll be able to see all liked posts here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};