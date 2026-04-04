import type { Metadata } from "next";
import "./globals.css";
import { seo, candidate } from "@/lib/data";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title:       seo.title,
  description: seo.description,
  openGraph: {
    title:       seo.title,
    description: seo.description,
    images:      [{ url: seo.ogImage, width: 1200, height: 630 }],
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       seo.title,
    description: seo.description,
    images:      [seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
