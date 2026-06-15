import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { spotifyDeviceIdState } from "../atoms/playerAtom";
import useSpotify from "../hooks/useSpotify";
import MinutesAndSeconds from "../lib/time";

function Song({ order, track }) {
    const spotifyApi = useSpotify();
    const [deviceId] = useRecoilState(spotifyDeviceIdState);
    const [, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = async () => {
        if (!spotifyApi.getAccessToken()) {
            console.error("Brak tokenu dostępu — zaloguj się ponownie");
            return;
        }

        setCurrentTrackId(track.track.id);
        setIsPlaying(true);

        try {
            if (deviceId) {
                await spotifyApi.transferMyPlayback([deviceId]);
            }
            await spotifyApi.play({
                uris: [track.track.uri],
                ...(deviceId && { device_id: deviceId }),
            });
        } catch (error) {
            console.error("Nie udało się odtworzyć utworu:", error);
            setIsPlaying(false);
        }
    };

    return (
        <div
            className="grid grid-cols-2 text-gray-500 py-2 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
            onClick={playSong}
        >
            <div className="flex items-center space-x-4">
                <p className="w-6 text-right bold">{order + 1}.</p>
                <img
                    className="h-10 w-10"
                    src={track.track.album.images[0].url}
                    alt=""
                />
                <div>
                    <p className="w-36 lg:w-96 text-white truncate">
                        {track.track.name}
                    </p>
                    <p className="w-96">{track.track.artists[0].name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 lg:w-96 truncate hidden md:inline">
                    {track.track.album.name}
                </p>
                <p>{MinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    );
}

export default Song;
