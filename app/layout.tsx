import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ChatbotProvider } from "@/components/ChatbotProvider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "HireCards - Instant Hiring Reality Check. Before You Waste 2 Months",
  description:
    "Get feasibility score, salary benchmarks, competition analysis, red flags and recommendations, in seconds. Turn hiring chaos into data-driven decisions.",
  keywords:
    "hiring, recruitment, job cards, battle cards, HR tech, hiring process, talent acquisition, salary benchmarks, hiring feasibility",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${poppins.variable} ${spaceGrotesk.variable}`}
    >
      <body
        className="antialiased overflow-x-hidden"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        <ChatbotProvider>{children}</ChatbotProvider>
      </body>
    </html>
  );
}
