import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Copy, Edit, Trash2, Eye, Heart, MessageCircle, Plus } from "lucide-react";

export interface postType {
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

export interface ApiResponse {
  messsage: string;
  AllPosts: postType[];
}

export interface likeResponse {
  message: string;
  likes: number;
  likedBy: [];
}

function PostCard({ post, currentUser, onEdit, onDelete }: {
  post: postType;
  currentUser: { _id: string; role: string; name: string } | null;
  onEdit: (postId: string, newTitle: string, newContent: string) => void;
  onDelete: (postId: string) => void;
}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [likes, setLikes] = useState(post.likedBy.length);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = localStorage.getItem("token") ? true : false;
  const canEditDelete = currentUser && 
    (currentUser._id === post.postedBy._id || currentUser.role === 'admin');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.info("Please log in to like post");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/post/like/` + post._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token") || "",
        },
      });
      const data: likeResponse = await res.json();
      setLikes(data.likedBy.length);
      toast.success(data.message);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = `${post.title}\n\n${post.content}`;
      await navigator.clipboard.writeText(textToCopy);
      setShowMenu(false);
      toast.success("Post copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim() && 
        (editTitle !== post.title || editContent !== post.content)) {
      onEdit(post._id, editTitle, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
    setShowMenu(false);
  };

  const truncatedContent = post.content.split(" ").slice(0, 15).join(" ") + 
    (post.content.split(" ").length > 15 ? "..." : "");

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mb-6 h-fit">
      
      {/* Post Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(`/Profile/${post.postedBy._id}`)} className="flex items-center space-x-3">
              <img 
                src={post.postedBy.avatar} 
                alt="User avatar" 
                className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover"
              />
              <div>
                <p className="font-semibold text-white text-sm">
                  {post.postedBy.name}
                </p>
                <span className="text-xs text-slate-400">
                  {new Date(post.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </button>
          </div>

          {/* 3-Dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-200"
            >
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 py-2 z-20">
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3"
                >
                  <Eye className="w-4 h-4" />
                  <span>See More</span>
                </button>

                {canEditDelete && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center space-x-3"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {post.postImage && (
          <div className="mb-3">
            <img 
              src={post.postImage} 
              alt="Post image" 
              className="w-full h-48 object-cover rounded-lg border border-slate-700/50"
            />
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 text-sm border border-slate-600 rounded-lg bg-slate-700/50 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Content
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 text-sm border border-slate-600 rounded-lg bg-slate-700/50 text-white resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
              {post.title}
            </h2>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-3">
              {truncatedContent}
            </p>

            {post.content.split(" ").length > 15 && (
              <button
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm mb-3"
              >
                Read more
              </button>
            )}
          </>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors duration-200"
          >
            <Heart className="w-4 h-4" />
            <span className="font-medium text-sm">{likes}</span>
          </button>

          <button
            onClick={() => navigate(`/post/${post._id}`)}
            className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium text-sm">{post.commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState<postType[]>([]);
  const [currentUser, setCurrentUser] = useState<{_id: string, role: string, name: string} | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/post/")
      .then((res) => res.json())
      .then((data: ApiResponse) => setPosts(data.AllPosts))
      .catch(() => toast.error("Failed to load posts"));
  }, []);

  const handleEditPost = async (postId: string, newTitle: string, newContent: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/post/${postId}`, {
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
      const res = await fetch(`http://localhost:5000/api/post/${postId}`, {
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

  const navigate = useNavigate();

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
      
      {/* Header */}
    

      {/* Posts Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <PostCard
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