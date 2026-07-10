"use client";

import { MarketHeader } from "@/components/mock/MarketHeader";

export default function ScreensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketHeader />
      {children}
    </div>
  );
}
