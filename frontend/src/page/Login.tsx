import React, { useState } from "react";

interface loginInfo {
  message: string;
  success: boolean;
  user: object;
  token: string;
}
export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loding, setLoding] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoding(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data: loginInfo = await res.json();
      console.log("Success:", data);
    } catch (err) {
    } finally {
      setLoding(false);
    }
  };
  return (
    <div className="flex align-center justify-center p-8">
      <form action="" onSubmit={handleSubmit} className="h-200 w-150 border-2 rounded-2xl">
        <h1>Login</h1>
        <div>
          <label htmlFor="">
            Email
            <input
              type="text"
              placeholder="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </label>
        </div>
        <div>
          <label htmlFor="">
            Password
            <input
              type="Password"
              placeholder="Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </label>
        </div>
        <button disabled={loding}  > {loding ? "Loading.." : "SignUP"}</button>
      </form>
    </div>
  );
}
