// app/layout.js
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

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
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
