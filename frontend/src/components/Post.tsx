import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Copy, Edit, Trash2, Eye, Heart, MessageCircle, Share, Bookmark } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
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

export interface likeResponse {
  message: string;
  likes: number;
  likedBy: [];
}

export interface PostProps {
  post: postType;
  currentUser: { _id: string; role: string; name: string } | null;
  onEdit: (postId: string, newTitle: string, newContent: string) => void;
  onDelete: (postId: string) => void;
}

export default function Post({ post, currentUser, onEdit, onDelete }: PostProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(post.title);
  const [editContent, setEditContent] = useState<string>(post.content);
  const [likes, setLikes] = useState<number>(post.likedBy.length);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = localStorage.getItem("token") ? true : false;
  const canEditDelete = currentUser && 
    (currentUser._id === post.postedBy._id || currentUser.role === 'admin');

  // Check if user already liked this post
  useEffect(() => {
    if (currentUser && post.likedBy) {
      setIsLiked(post.likedBy.some((like: any) => like === currentUser._id));
    }
  }, [currentUser, post.likedBy]);

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

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`${BASE_URL}/post/like/${post._id}`, {
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
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikes(post.likedBy.length);
      console.log("Error", err);
      toast.error("Failed to update like");
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
      toast.error("Failed to copy text");
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: post.title,
        text: post.content.slice(0, 100) + "...",
        url: `${window.location.origin}/post/${post._id}`
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to share: ', err);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    setShowMenu(false);
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

  const truncatedContent = post.content.split(" ").slice(0, 20).join(" ") + 
    (post.content.split(" ").length > 20 ? "..." : "");

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/50">
      
      {/* Post Header */}
      <header className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(`/Profile/${post.postedBy._id}`)} 
            className="flex items-center space-x-3 group/author hover:bg-slate-700/30 rounded-xl p-2 -ml-2 transition-all duration-200"
          >
            <div className="relative">
              <img 
                src={post.postedBy.avatar} 
                alt={`${post.postedBy.name}'s avatar`}
                className="w-12 h-12 rounded-full border-2 border-slate-600 object-cover group-hover/author:border-purple-400 transition-colors duration-200"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div>
              <p className="font-semibold text-white group-hover/author:text-purple-300 transition-colors duration-200">
                {post.postedBy.name}
              </p>
              <span className="text-sm text-slate-400">
                {timeAgo(post.updatedAt)}
              </span>
            </div>
          </button>

          {/* 3-Dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 rounded-full hover:bg-slate-700/50 transition-all duration-200 hover:rotate-90"
            >
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3 transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy text</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3 transition-colors duration-200"
                >
                  <Share className="w-4 h-4" />
                  <span>Share post</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3 transition-colors duration-200"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Remove bookmark' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>View details</span>
                </button>

                {canEditDelete && (
                  <>
                    <div className="border-t border-slate-700 my-1"></div>
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit post</span>
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/30 flex items-center space-x-3 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete post</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Post Content */}
      <main className="px-6">
        {post.postImage && (
          <div className="mb-4 relative overflow-hidden rounded-xl">
            {!imageLoaded && (
              <div className="w-full h-48 bg-slate-700/50 animate-pulse rounded-xl flex items-center justify-center">
                <div className="text-slate-400">Loading image...</div>
              </div>
            )}
            <img 
              src={post.postImage} 
              alt="Post content"
              className={`w-full h-48 object-cover rounded-xl border border-slate-700/50 cursor-pointer hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? 'block' : 'hidden'
              }`}
              onClick={() => navigate(`/post/${post._id}`)}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-3 text-sm border border-slate-600 rounded-lg bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter post title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 text-sm border border-slate-600 rounded-lg bg-slate-700/50 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                rows={4}
                placeholder="Share your thoughts..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-100 transition-colors duration-200 cursor-pointer" 
                onClick={() => navigate(`/post/${post._id}`)}>
              {post.title}
            </h2>
            
            <p className="text-slate-300 leading-relaxed mb-4 line-clamp-3">
              {truncatedContent}
            </p>

            {post.content.split(" ").length > 20 && (
              <button
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-purple-400 hover:text-purple-300 font-medium text-sm hover:underline transition-all duration-200"
              >
                Continue reading →
              </button>
            )}
          </div>
        )}
      </main>

      {/* Post Actions */}
      <footer className="px-6 py-4 border-t border-slate-700/30 bg-slate-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${
                isLiked 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likes}</span>
            </button>

            <button
              onClick={() => navigate(`/post/${post._id}`)}
              className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-all duration-200 hover:scale-110"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.commentCount}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isBookmarked 
                  ? 'text-yellow-400 bg-yellow-400/10' 
                  : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/5'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-slate-400 hover:text-green-400 hover:bg-green-400/5 transition-all duration-200 hover:scale-110"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}