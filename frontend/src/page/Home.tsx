import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface postType {
  title: string;
  content: string;
  postImage: string;
  postedBy : {
    _id : string;
    name : string;
    avatar : string;
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
export interface likeResponse{
message : string;
likes : number;
likedBy : []
}
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const navigate = useNavigate(); 
  const[like,setLike]=useState<number>(0);
  const [posts, setPosts] = useState<postType[]>([]);
  const isLoggedIn: boolean = localStorage.getItem("token") ? true : false;
  useEffect(() => {
    fetch("http://localhost:5000/api/post/")
      .then((res) => res.json())
      .then((data: ApiResponse) => setPosts(data.AllPosts))
      .catch(() => toast.error("Failed to load posts"));
  }, []);
 
  const handleLike = async (postId: string) => {
    console.log(localStorage.getItem("token"));
    if (!isLoggedIn) {
      toast.info("Please log in to like post");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/post/like/` + postId, {
        method: "POST",
        headers : {
           "Content-Type": "application/json",
         "token": localStorage.getItem("token") || "",
        },

      }).then((res)=>res.json())
      .then((data :likeResponse)=>{
        setLike(data.likedBy.length)
        console.log(data)
        toast.success(data.message);
      }).catch((err : unknown)=> console.log(err))
      console.log("succes" + res);
    } catch (err: unknown) {
      console.log("Error", err);
    }
  };
  return (
    <div>
      <ToastContainer />
      <h1>Home Page </h1>
      {posts.map((post) => ( 
        <div className="border-2 m-5" key={post._id}>
         <div> <img className="h-12 w-12" src={post.postedBy.avatar} alt="" /> <span>{post.postedBy.name}</span> <span>{new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
})}</span></div>
          <div className="flex justify-center mt-4"><img src={post.postImage} className="h-50 w-70" alt="" /></div>
          <h3 className="">Title : {post.title}</h3>
          <p>{post.content.split(" ").slice(0,6).join(" ")}...</p> <button onClick={() => navigate(`/post/${post._id}`)}>See More</button>

          <button onClick={() => handleLike(post._id)}>Like {like}</button>
          <span> Comments {post.commentCount}</span>
        </div>
      ))}
    </div>
  );
}
