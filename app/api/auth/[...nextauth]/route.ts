import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// ✅ App Router requires this format
export { handler as GET, handler as POST };