import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Forms | Lindsay Precast",
  description: "Manage and create forms for Lindsay Precast",
};

export const viewport: Viewport = {
  themeColor: "#1f2937",
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
