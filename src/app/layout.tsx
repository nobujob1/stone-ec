import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天然石ブレスレット専門店",
  description: "一点一点丁寧に制作した天然石ブレスレットをお届けします",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-taupe-900 antialiased">
        {children}
      </body>
    </html>
  );
}
