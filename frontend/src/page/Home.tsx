import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface postType {
  title: string;
  content: string;
  postImage: string;
  _id: string;
  likedBy: [];
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

export default function HomePage() {
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
      }).then((res)=>res.json())
      .then((data :likeResponse)=>{
        console.log(data)
      }).catch((err : unknown)=> console.log(err))

      toast.success("Liked post");
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
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => handleLike(post._id)}>Like</button>
        </div>
      ))}
    </div>
  );
}
