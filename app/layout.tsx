import type { Metadata } from "next";
import { Inter, Crimson_Text, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/QueryCLient";
import Header from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import { Toaster } from "react-hot-toast";

// Modern, clean sans-serif for UI elements and body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Elegant serif for headings and artistic content
const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const poppinsText = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
        className={`${inter.variable} ${crimsonText.variable} ${poppinsText.variable} antialiased font-sans`}
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