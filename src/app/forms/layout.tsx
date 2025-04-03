import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms | Lindsay Precast",
  description: "Manage and create forms for Lindsay Precast",
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
