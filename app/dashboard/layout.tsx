"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-lg cursor-pointer transition ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-5 shadow-lg flex flex-col justify-between">
        
        <div>
          <h2 className="text-2xl font-bold mb-8">📊 TradePro</h2>

          <nav className="space-y-2">
            <Link href="/dashboard">
              <p className={linkClass("/dashboard")}>📈 Dashboard</p>
            </Link>

            <Link href="/dashboard/trades">
              <p className={linkClass("/dashboard/trades")}>📂 Trades</p>
            </Link>
          </nav>
        </div>

        {/* Bottom */}
        <div className="space-y-4">
          <ThemeToggle />

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content (SCROLL FIX HERE) */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>

    </div>
  );
}