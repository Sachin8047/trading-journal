"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={() => signIn("google")}
        className="bg-white text-black px-6 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  );
}