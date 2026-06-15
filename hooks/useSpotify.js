import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
});

function useSpotify() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.accessToken) {
            return;
        }

        if (session.error === "RefreshAccessTokenError") {
            signIn("spotify");
            return;
        }

        spotifyApi.setAccessToken(session.user.accessToken);
    }, [session]);

    return spotifyApi;
}

export default useSpotify;
