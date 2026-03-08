import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knox Wedding",
  description: "A celebration of love",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
