import SpotifyWebApi from "spotify-web-api-node";

const SPOTIFY_SCOPES = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
].join(" ");

const queryParamString = new URLSearchParams({ scope: SPOTIFY_SCOPES });

const LOGIN_URL =
    "https://accounts.spotify.com/authorize?" + queryParamString.toString();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret:
        process.env.SPOTIFY_CLIENT_SECRET ||
        process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;
export { LOGIN_URL, SPOTIFY_SCOPES };
