import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-5 shadow">
        <h2 className="text-xl font-bold mb-6">📊 TradePro</h2>

       <nav className="space-y-3">
  <Link href="/dashboard">
    <p className="hover:text-blue-500 cursor-pointer">📊 Dashboard</p>
  </Link>

  <Link href="/dashboard/trades">
    <p className="hover:text-blue-500 cursor-pointer">📋 Trades</p>
  </Link>
</nav>

        <div className="mt-6">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}