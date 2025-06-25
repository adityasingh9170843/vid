"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import axios from "axios";
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
        //react-query ,loading,error,formhook
      const response = await axios.post("/api/auth/register", {
        email,
        password,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      console.log(response.data.user);
      
    } catch (err) {
      console.error(err);
    }
  };

  return <div>
    <h1>Register</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
    <div>
      <p>
        Already have an account? <button onClick={() => router.push("/login")}>Login</button>
      </p>
    </div>
  </div>;
}

export default RegisterPage;
