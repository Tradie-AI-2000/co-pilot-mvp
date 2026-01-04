import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stellar Recruitment Co-Pilot",
  description: "Intelligent recruitment assistant for labour hire and trade roles.",
};

import Sidebar from "../components/sidebar.js";
import ClientProviders from "../components/client-providers.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
        <ClientProviders>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
