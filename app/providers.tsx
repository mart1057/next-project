'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  )
}
