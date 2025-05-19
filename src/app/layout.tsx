"use client";
import { useState } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const onToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-900">
        <Header onToggleSidebar={onToggleSidebar} isSidebarOpen={isSidebarOpen}/>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[#0d113d] opacity-40 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex">
          <Sidebar isSidebarOpen={isSidebarOpen}  onClose={() => setSidebarOpen(false)}/>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
