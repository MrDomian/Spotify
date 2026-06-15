import { useState } from "react";
import Script from "next/script";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";

function SpotifyPlayerProvider() {
    const [sdkReady, setSdkReady] = useState(false);
    useSpotifyPlayer(sdkReady);

    return (
        <Script
            src="https://sdk.scdn.co/spotify-player.js"
            strategy="afterInteractive"
            onLoad={() => setSdkReady(true)}
        />
    );
}

export default SpotifyPlayerProvider;
