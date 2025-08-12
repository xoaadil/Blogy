import { useState,useEffect } from "react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
export interface postApi {
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


export interface commentApi{
    content : string;
    commentedby : string;
    onPost : string;
}

export default function Post(){
     const {id}=useParams<{id : string}>();
    const[post,setPost]= useState<postApi>();
    useEffect(()=>{
fetch("http://localhost:5000/api/post/single/" + id)
         .then((res)=>res.json())
         .then((data : postApi)=>setPost(data))
        .catch(() => toast.error("Failed to load posts"));
    }
    ,[id]) 
    console.log(post);
    return(<>
    <ToastContainer/>
    <h1>{post?.content} </h1></>)
}