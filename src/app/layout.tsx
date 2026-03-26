import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luxe Salon | Premium Hair & Beauty",
  description: "Experience the ultimate in luxury hair and beauty services. Book your appointment today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-gold">LUXE SALON</Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                  <Link href="/services" className="hover:text-gold transition-colors">Services</Link>
                  <Link href="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
                  <Link href="/about" className="hover:text-gold transition-colors">About</Link>
                  <Link href="/booking" className="bg-gold text-black px-4 py-2 rounded-md font-medium hover:bg-gold-muted transition-colors">Book Now</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <footer className="bg-black py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2026 Luxe Salon. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
