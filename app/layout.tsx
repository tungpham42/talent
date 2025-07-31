import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { getHostUrl } from "@/lib/getHostUrl";

export async function generateMetadata(): Promise<Metadata> {
  const hostUrl = await getHostUrl();
  return {
    title: "Streamline Your Hiring Process with TalentApp",
    description:
      "TalentApp is your all-in-one solution for managing job postings, candidates, and interviews. Simplify your hiring process with our intuitive platform.",
    keywords: [
      "hiring software",
      "job management",
      "candidate tracking",
      "interview scheduling",
      "recruitment tool",
      "talent management",
    ],
    openGraph: {
      title: "TalentApp - Streamline Your Hiring Process",
      description:
        "TalentApp is your all-in-one solution for managing job postings, candidates, and interviews. Simplify your hiring process with our intuitive platform.",
      type: "website",
      url: `${hostUrl}`,
      images: [
        {
          url: `${hostUrl}/1200x630.jpg`,
          width: 1200,
          height: 630,
          alt: "TalentApp - Streamline Your Hiring Process",
        },
      ],
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex bg-gray-100">
          <aside className="w-64 bg-white shadow-lg p-4">
            <h1 className="text-xl font-bold mb-6">Talent App</h1>
            <nav className="space-y-2">
              <Link href="/" className="block p-2 hover:bg-gray-200 rounded">
                Dashboard
              </Link>
              <Link
                href="/candidates"
                className="block p-2 hover:bg-gray-200 rounded"
              >
                Candidates
              </Link>
              <Link
                href="/jobs"
                className="block p-2 hover:bg-gray-200 rounded"
              >
                Jobs
              </Link>
              <Link
                href="/interviews"
                className="block p-2 hover:bg-gray-200 rounded"
              >
                Interviews
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
