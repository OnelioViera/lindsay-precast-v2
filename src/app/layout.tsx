import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lindsay Precast",
  description: "Lindsay Precast - Quality Precast Concrete Products",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#1f2937",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
