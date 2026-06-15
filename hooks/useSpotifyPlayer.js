import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import { spotifyDeviceIdState } from "../atoms/playerAtom";

function useSpotifyPlayer(sdkReady) {
    const { data: session } = useSession();
    const setDeviceId = useSetRecoilState(spotifyDeviceIdState);
    const playerRef = useRef(null);

    useEffect(() => {
        if (
            !sdkReady ||
            !session?.user?.accessToken ||
            typeof window === "undefined" ||
            !window.Spotify
        ) {
            return;
        }

        const player = new window.Spotify.Player({
            name: "Spotify4Fun Web Player",
            getOAuthToken: (cb) => cb(session.user.accessToken),
            volume: 0.5,
        });

        player.addListener("ready", ({ device_id }) => {
            console.log("Web Playback SDK ready, device:", device_id);
            setDeviceId(device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
            console.log("Web Playback SDK offline:", device_id);
            setDeviceId(null);
        });

        player.addListener("initialization_error", ({ message }) => {
            console.error("Web Playback SDK init error:", message);
        });

        player.addListener("authentication_error", ({ message }) => {
            console.error("Web Playback SDK auth error:", message);
        });

        player.addListener("account_error", ({ message }) => {
            console.error("Web Playback SDK account error:", message);
        });

        player.connect();
        playerRef.current = player;

        return () => {
            player.disconnect();
            playerRef.current = null;
            setDeviceId(null);
        };
    }, [sdkReady, session?.user?.accessToken, setDeviceId]);

    return playerRef.current;
}

export default useSpotifyPlayer;
