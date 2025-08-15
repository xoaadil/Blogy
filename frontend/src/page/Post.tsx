import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import CommentWithMenu from "./CommentWithMenu ";
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

interface postResponse {
  message: string;
  Post: postApi;
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

export default function Post() {
  const { theme, setTheme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<postApi>();
  const [comment, setComment] = useState<commentApi[]>();
  const [content, setContent] = useState<string>("");
  const[loding,setLoding]=useState<boolean>(false);

 const createAcomment = async () => {
  if(!localStorage.getItem("token")) {toast.error("plese login to comment")
    return;
  }
  try {
    const res = await axios.post(
      "http://localhost:5000/api/comment/"+ id,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
      }
    );
    console.log("Response:", res.data);
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    setLoding(true);
    fetch("http://localhost:5000/api/post/single/" + id)
      .then((res) => res.json())
      .then((data: postResponse) => {
        console.log("API Response:", data);
        setPost(data.Post);
      })
      .catch(() => toast.error("Failed to load post")).finally(()=>setLoding(false))
  }, [id]);

  useEffect(() => {
    setLoding(true);
    axios
      .get<commentApi[]>("http://localhost:5000/api/comment/" + id)
      .then((res) => {
        console.log(" comment API Response:", res);
        setComment(res.data);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      }).finally(()=>setLoding(false))
  }, [id]);

  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState<{_id: string, role: string, name: string} | null>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Handle comment edit
  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await axios.put(`http://localhost:5000/api/comment/${commentId}`, 
        { content: newContent },
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
        }
      );
      
      // Update local state
      setComment(prev => prev?.map(c => 
        c._id === commentId ? { ...c, content: newContent } : c
      ));
      
      console.log("Comment updated successfully");
    } catch (err: any) {
      console.error("Error updating comment:", err.response?.data || err.message);
    }
  };

  // Handle comment delete
  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/comment/${commentId}`, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
      });
      
      // Remove from local state
      setComment(prev => prev?.filter(c => c._id !== commentId));
      
      console.log("Comment deleted successfully");
    } catch (err: any) {
      console.error("Error deleting comment:", err.response?.data || err.message);
    }
  };

if(loding) return (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
    <div className="text-lg text-gray-600 dark:text-gray-300">Loading post...</div>
  </div>
);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <ToastContainer />
      
      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Post Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                
                <img 
                  src={post?.postedBy?.avatar} 
                  alt="User avatar" 
                  className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {post?.postedBy?.name}
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post?.updatedAt
                      ? new Date(post.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
              </div>
              
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
              >
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 text-gray-700 dark:text-gray-300 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            {post?.postImage && (
              <div className="mb-4">
                <img 
                  src={post.postImage} 
                  alt="Post image" 
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {post?.title}
            </h1>
            
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {post?.content}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          
          {/* Comments Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Comments
              </h2>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
                {comment?.length || 0}
              </span>
            </div>
          </div>

          {/* Add Comment Form */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Write your thoughts on this post..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(e.target.value)
                }
              />
              <button 
                type="submit" 
                onClick={createAcomment}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="p-6">
            {comment?.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comment?.map((comment) => (
                  <CommentWithMenu
                    key={comment._id}
                    comment={comment}
                    currentUser={currentUser}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}