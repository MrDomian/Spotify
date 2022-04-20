import "../styles/globals.css"
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps: { session, ...pagePros} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pagePros} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default MyApp
