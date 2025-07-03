// app/layout.js
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export const metadata = {
  title: "Roommates",
  description: "best room sharing",
  icons: [
    {
      rel: "icon",
      url: "/sml pix.png",
      sizes: "5x5",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div></div>}>
          <NavBar />
        </Suspense>

        {/* Children usually won't need suspense here unless they use useSearchParams() at top level */}
        {children}

        <Suspense fallback={<div></div>}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
