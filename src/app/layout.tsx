import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lindsay Precast",
  description: "Official website for Lindsay Precast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-gray-900 dark:bg-gray-900 text-white dark:text-white transition-colors duration-200`}
      >
        {children}
      </body>
    </html>
  );
}
