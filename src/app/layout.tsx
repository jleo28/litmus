import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/shared/SplashScreen";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Litmus — CPT offer checker",
  description:
    "Paste a job listing or offer letter and see exactly where it collides with your school's published CPT rules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${ibmPlexSans.variable} h-full`}
    >
      <body className="min-h-screen flex flex-col bg-page font-sans text-ink antialiased">
        <SplashScreen />
        <Header />
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
