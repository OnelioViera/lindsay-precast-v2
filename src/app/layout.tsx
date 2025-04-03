import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Lindsay Precast",
  description: "Lindsay Precast - Quality Precast Concrete Products",
  icons: {
    icon: [
      {
        url: "/lindsay-logo.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/lindsay-logo.svg",
    apple: "/lindsay-logo.svg",
  },
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/lindsay-logo.svg" />
        <link
          rel="shortcut icon"
          type="image/svg+xml"
          href="/lindsay-logo.svg"
        />
        <link
          rel="apple-touch-icon"
          type="image/svg+xml"
          href="/lindsay-logo.svg"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
