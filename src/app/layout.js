import localFont from "next/font/local";
import "./globals.scss";
import { Provider } from "../../Providers";
import Script from "next/script";
import GoogleAnalytics from "../../utils/GoogleAnalytics.js";

export const metadata = {
  metadataBase: new URL("https://arkalalchakravarty.com"),
  title: {
    default: "Arka Lal Chakravarty - Web Development & AI Solutions",
    template: "%s | Arka Lal Chakravarty",
  },
  description:
    "Expert web development services including AI-powered solutions, high-performance websites, and custom integrations. Get professional web design and development services.",
  keywords: [
    "web development",
    "AI solutions",
    "website design",
    "Next.js development",
    "custom AI integration",
    "high-performance websites",
  ],
  authors: [{ name: "Arka Lal Chakravarty" }],
  canonical: "https://arkalalchakravarty.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arkalalchakravarty.com",
    title: "Arka Lal Chakravarty - Web Development & AI Solutions",
    description:
      "Expert web development services including AI-powered solutions, high-performance websites, and custom integrations.",
    siteName: "Arka Lal Chakravarty",
    images: [
      {
        url: "/images/og-image.jpg", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Arka Lal Chakravarty - Web Development & AI Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arka Lal Chakravarty - Web Development & AI Solutions",
    description:
      "Expert web development services including AI-powered solutions, high-performance websites, and custom integrations.",
    images: ["/images/og-image.jpg"], // Same image as OG
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const CustomFont = localFont({
  src: [
    {
      path: "./fonts/07a54048a9278940-s.p.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/07a54048a9278940-s.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "./fonts/4f2204fa15b9b11a-s.p.woff2",
      weight: "600",
      style: "semi-bold",
    },
    {
      path: "./fonts/90475aac776488b6-s.p.woff2",
      weight: "600",
      style: "semi-itlaic",
    },
    {
      path: "./fonts/a34f9d1faa5f3315-s.p.woff2",
      weight: "600",
      style: "custom",
    },
    {
      path: "./fonts/CircularXXWeb-Book.woff2",
      weight: "500",
      style: "circular",
    },
  ],
  variable: "--font-custom", // Optional: you can define a CSS variable for custom font
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics GA_MEASUREMENT_ID="G-MD32GNY568" />

      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Arka Lal Chakravarty",
              description:
                "Expert web development services including AI-powered solutions",
              image: "/images/og-image.jpg",
              url: "https://arkalalchakravarty.com",
              address: {
                "@type": "PostalAddress",
                addressCountry: "India",
              },
              priceRange: "$$",
              serviceType: [
                "Web Development",
                "AI Integration",
                "Website Design",
              ],
            }),
          }}
        />
      </head>

      <body className={CustomFont.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
