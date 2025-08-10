import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface signupinfo {
  message: string;
  success: boolean;
  user: object;
  token: string;
}
export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loding, setLoding] = useState<boolean>(false);
  const [admincode, setAdmincode] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoding(true);
     // Basic validation
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields!");
      setLoding(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, admincode }),
      });
      const data: signupinfo = await res.json();
      console.log("Success:", data);
    } catch (err: unknown) {
      console.log("Error", err);
    } finally {
      setLoding(false);
    }
  };
  return (
    <div className="flex align-center justify-center p-8">
      <form onSubmit={handleSubmit} className="h-200 w-150 border-2 rounded-2xl">
        <h1    className="text-5xl p-4 flex justify-center align-center">Sign UP </h1>
         <div> <label htmlFor="">
          name{" "}
          <input
            className="h-12 w-24 border-2"
            placeholder="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </label></div>
        <div><label htmlFor="">
          {" "}
          email
          <input
            className="h-12 w-36 border-2"
            value={email}
            placeholder="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </label></div>

       <div> <label htmlFor="password">
          {" "}
          password
          <input
            type="password"
            className="h-12 w-24 border-2"
            name="password"
            value={password}
            placeholder="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </label></div>
       
       
       <div> <label htmlFor="">
          admin code{" "}
          <input   className="h-12 w-24 border-2"
            value={admincode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAdmincode(e.target.value)
            }
          />
        </label></div>

        <button className="h-12 w-24 border-2" disabled={loding}>
          {loding ? "Loading..." : "Sign up"}
        </button>
      </form>{" "}
        <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    </div>
  );
}
