import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Social.ai | Social Media Scheduling",
  description: "Create AI-powered social media scheduling for every platform in seconds. Social.ai is a platform that allows you to create social media scheduling for every platform in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClerkProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
