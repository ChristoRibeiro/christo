import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christophe Ribeiro",
  description: "Technical founder. I build and ship products, solo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
