import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";
import { WalletProvider } from "@/contexts/WalletContext";
import { NFTProvider } from "@/contexts/NFTContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MFT Marketplace",
  description: "A decentralized marketplace for managed file transfer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <NFTProvider>
              <Layout>{children}</Layout>
            </NFTProvider>
          </WalletProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
