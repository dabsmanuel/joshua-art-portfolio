import type { Metadata } from "next";
import { Syne, Instrument_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/QueryCLient";
import Header from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { Toaster } from "react-hot-toast";

// Wide, slightly eccentric display face for names and titles
const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Quiet humanist sans for reading
const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Typewriter-style mono for wall labels and catalogue details
const dmMono = DM_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
        className={`${syne.variable} ${instrumentSans.variable} ${dmMono.variable} antialiased`}
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
