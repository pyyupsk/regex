import "@/assets/css/globals.css";

import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";
import { mono, sans } from "@/assets/fonts";
import { commonMetaData } from "@/lib/meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = commonMetaData({
  title:
    "Powerful Regex Tester with Cheatsheet - Test and Learn Regex Patterns",
  description:
    "Easily test and learn regular expressions with our interactive Regex Tester. Access a complete cheatsheet, covering basic characters, anchors, character classes, quantifiers, and lookarounds.",
});

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(sans.variable, mono.variable)}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
