import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HireCards - Instant Hiring Reality Check. Before You Waste 2 Months",
  description:
    "Get feasibility score, salary benchmarks, competition analysis, red flags and recommendations — in seconds. Turn hiring chaos into data-driven decisions.",
  keywords:
    "hiring, recruitment, job cards, battle cards, HR tech, hiring process, talent acquisition, salary benchmarks, hiring feasibility",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
