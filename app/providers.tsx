'use client';

import { SessionProvider } from "next-auth/react";


// wrapper component that makes NextAuth's authentication state available throughout entire web
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}