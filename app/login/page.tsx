"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Redirect after login
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // ✅ Loading state
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border">

        {/* LOGO */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="text-4xl">📈</div>

          <h1 className="text-2xl font-bold mt-2">
            Welcome to TradePro
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Track. Analyze. Improve your trading.
          </p>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">
            Continue with Google
          </span>
        </button>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* OPTIONAL EMAIL UI */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          Continue with Email
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}