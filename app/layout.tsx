import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import "@beincom/web-ui/styles.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pre-Public Sales",
  description: "Pre-Public Sales",
  icons: "/favicon/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-5")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
