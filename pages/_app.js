import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import SpotifyPlayerProvider from "../components/SpotifyPlayerProvider";

function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <RecoilRoot>
                <SpotifyPlayerProvider />
                <Component {...pageProps} />
            </RecoilRoot>
        </SessionProvider>
    );
}

export default MyApp;
