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
        url: "https://media.glassdoor.com/sqll/908541/lindsay-precast-squarelogo-1499172248023.png",
        href: "https://media.glassdoor.com/sqll/908541/lindsay-precast-squarelogo-1499172248023.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
