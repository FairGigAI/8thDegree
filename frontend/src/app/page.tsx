"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!(ctx instanceof CanvasRenderingContext2D)) return;

    let animationFrameId: number;
    
    function drawWeb() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#314f61";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        );
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(drawWeb);
    }
    drawWeb();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await axios.post("/api/submit", data);
      alert("Submission successful!");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-20" />
      <div className="relative z-10 max-w-4xl text-center px-4">
        <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
          Welcome to 8thDegree.io
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          The Open-Source, Fair Freelance & Talent Connection Platform
        </p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <label className="block mb-2 text-gray-400">Name</label>
            <input type="text" name="name" className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded" required />
            
            <label className="block mb-2 text-gray-400">Email</label>
            <input type="email" name="email" className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded" required />
            
            <label className="block mb-2 text-gray-400">Phone (Optional)</label>
            <input type="text" name="phone" className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded" />
            
            <label className="block mb-2 text-gray-400">Company (Optional)</label>
            <input type="text" name="company" className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded" />
            
            <label className="block mb-2 text-gray-400">Interest Type</label>
            <select name="interest_type" className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded">
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
              <option value="both">Both</option>
            </select>
            
            <button type="submit" className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg hover:opacity-90">
              Join Waitlist
            </button>
          </form>
        </motion.div>
        <div className="flex space-x-4 mt-6 justify-center">
          <GoogleLogin onSuccess={(response) => console.log(response)} onError={() => console.log("Login Failed")} />
          <button onClick={() => signIn("github")} className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 hover:bg-gray-700">
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}