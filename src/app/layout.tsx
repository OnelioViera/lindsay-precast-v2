import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lindsay Precast",
  description: "Lindsay Precast Information Portal",
  icons: {
    icon: [
      {
        url: "/lindsay-logo.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/lindsay-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/lindsay-logo.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
