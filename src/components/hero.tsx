"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thanks for joining our waitlist!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Ever looked at the {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                food label
              </span>{" "}
              <span className="inline-block">and wondered</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              what the hell is Monosodium Glutamate? And didn't bother to look it up? Just devoured{" "}
              <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                whole box
              </span> again? I'm building an app to analyze ingredients and identify
              potentially harmful additives{" "}
              <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                instantly
              </span>
              {" "}Sounds like your problem? Join the waitlist. <br /> Oh, such app already exists? <br /> My will have funny little features...
            </p>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {status === "loading" ? "Joining..." : "Join Waitlist"}
                  </button>
                </div>
                {message && (
                  <p className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Health rating system</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Personalized analysis based on your preferences</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Barcode & photo scanning</span>
              </div>
            </div>          </div>
        </div>
      </div>
    </div>
  );
}
