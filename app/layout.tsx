import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/QueryCLient";
import Header from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joshua Otuonye",
  description: "My name is Joshua Otuonye, I am an African visual artist based in the United Kingdom. My artistic vision is to convey my unique perspectives and experiences through my creations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header isScrolled={true} />
          {children}
          <Footer/>
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
