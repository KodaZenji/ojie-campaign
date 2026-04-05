import type { Metadata } from "next";
import "./globals.css";
import { seo } from "@/lib/data";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata: Metadata = {
  metadataBase: new URL("https://ojie-campaign.vercel.app"), // ← THIS is what fixes it
  title:       seo.title,
  description: seo.description,
  openGraph: {
    title:       seo.title,
    description: seo.description,
    url:         "https://ojie-campaign.vercel.app",  // ← fixes the og:url warning
    siteName:    "Hon. Ojie Inegbeboh Campaign",
    images: [{
      url:    "https://ojie-campaign.vercel.app/images/og-image.jpg",
      width:  1200,
      height: 630,
      alt:    "Hon. Eugene Ojie Inegbeboh — Let's Do More 2027",
    }],
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card:        "summary_large_image",
    title:       seo.title,
    description: seo.description,
    images:      ["https://ojie-campaign.vercel.app/images/og-image.jpg"],
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
