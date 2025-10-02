import type { Metadata } from "next";
import { Manrope, Delicious_Handrawn, Schoolbell } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
const schoolbell = Schoolbell({
  variable: "--font-schoolbell",
  subsets: ["latin"],
  weight: ["400"],
});


export const metadata: Metadata = {
  title: "Viska Digital",
  description: "Platform Digital Media Agency SMKN 6 Surakarta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${schoolbell.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
