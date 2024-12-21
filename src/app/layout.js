import localFont from "next/font/local";
import "./globals.scss";
import { Provider } from "../../Providers";

export const metadata = {
  title: "Arka Lal Chakravarty",
  description: "My services and portfolio",
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
      <body className={CustomFont.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
