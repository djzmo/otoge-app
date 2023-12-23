import '@/styles/globals.css'
import '@/styles/sheets.css'
import type { AppProps } from 'next/app'
import {ThemeProvider} from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return <ThemeProvider>
    <Component {...pageProps} />
  </ThemeProvider>
}
