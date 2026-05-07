import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(); // ✅ NO authOptions

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}