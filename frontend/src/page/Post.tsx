import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  content: string;
  commentedby: {
    _id: string;
    name: string;
    avatar: string;
  };
  onPost: string;
}

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<postApi>();
  const [comment, setComment] = useState<commentApi[]>();

  useEffect(() => {
    fetch("http://localhost:5000/api/post/single/" + id)
      .then((res) => res.json())
      .then((data: postResponse) => {
        console.log("API Response:", data);
        setPost(data.Post); // ✅ Extract only the Post object
      })
      .catch(() => toast.error("Failed to load post"));
  }, [id]);

  useEffect(()=>{
     axios.get<commentApi[]>("http://localhost:5000/api/comment/")
     .then((res)=>setComment(res.data))
     .catch((err) => {
        console.error(err.response?.data || err.message) }) 
  },[])

  return (
    <>
      <ToastContainer />
      <div className=" flex flex-col justify-center align-center w-[90%] pl-[10%]">
        <div>
          {" "}
          <span>
            {" "}
            <img src={post?.postedBy.avatar} alt="" />
          </span>{" "}
          <p className="h-12 w-12 border-2">{post?.postedBy.name} </p>
          <span>
            {post?.updatedAt
              ? new Date(post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>
        <p>
          <img src={post?.postImage} alt="" />
        </p>
        <p>title : {post?.title}</p>
        <p className=""> Content : {post?.content} </p>
      </div>
    </>
  );
}
