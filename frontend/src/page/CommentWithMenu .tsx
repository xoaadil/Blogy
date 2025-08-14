import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Copy, Edit, Trash2 } from "lucide-react";

interface CommentMenuProps {
  comment: {
    _id: string;
    content: string;
    commentedBy: {
      _id: string;
      name: string;
      avatar: string;
    };
    updatedAt: Date;
  };
  currentUser: {
    _id: string;
    role: string;
    name: string;
  } | null;
  onEdit: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
}

export default function CommentWithMenu({ comment, currentUser, onEdit, onDelete }: CommentMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if user can edit/delete
  const canEditDelete = currentUser && 
    (currentUser._id === comment.commentedBy._id || currentUser.role === 'admin');

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(comment.content);
      setShowMenu(false);
      console.log("Comment copied!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment._id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment._id);
    }
    setShowMenu(false);
  };

  return (
    <div className="flex space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 group">
      <img 
        src={comment.commentedBy?.avatar} 
        alt="Commenter avatar" 
        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900 dark:text-white">
              {comment.commentedBy.name}
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {comment.updatedAt
                ? new Date(comment.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>

          {/* 3-Dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                
                {/* Copy Option - Always visible */}
                <button
                  onClick={handleCopy}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>

                {/* Edit & Delete - Only for owner or admin */}
                {canEditDelete && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comment Content - Editable */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              rows={2}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}