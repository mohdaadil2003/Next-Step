"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: "12px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        }}
      />
    </SessionProvider>
  );
}
