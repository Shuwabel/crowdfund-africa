'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { useStore } from '@/lib/store'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Seeded data renders on the server; saved browser data takes over once mounted.
    void useStore.persist.rehydrate()
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
