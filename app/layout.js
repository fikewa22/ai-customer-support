import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Headstarter AI Support - Intelligent Customer Service",
  description:
    "Get instant help from our AI-powered customer support assistant. Fast, reliable, and always available.",
  keywords: "AI support, customer service, chatbot, Headstarter",
  authors: [{ name: "Headstarter" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
