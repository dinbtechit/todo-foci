import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import {ThemeProvider} from "@/providers/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Foci Todo",
    description: "Coding challenge using React/NextJS",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider>
            <div className="flex flex-col h-full w-full overflow-hidden">
                <Header/>
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
