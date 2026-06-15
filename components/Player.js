import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    VolumeUpIcon,
    SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { spotifyDeviceIdState } from "../atoms/playerAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import debounce from "lodash/debounce";

function Player() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [deviceId] = useRecoilState(spotifyDeviceIdState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentIdTrack(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    };

    const handlePlayPause = async () => {
        try {
            const data = await spotifyApi.getMyCurrentPlaybackState();
            if (data.body?.is_playing) {
                await spotifyApi.pause();
                setIsPlaying(false);
            } else {
                if (deviceId) {
                    await spotifyApi.transferMyPlayback([deviceId]);
                }
                await spotifyApi.play({
                    ...(deviceId && { device_id: deviceId }),
                });
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Nie udało się przełączyć odtwarzania:", error);
        }
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(100);
        }
    }, [currentTrackId, spotifyApi, session]);

    const debouncedAdjustVolume = useCallback(
        debounce((vol) => {
            spotifyApi.setVolume(vol).catch((err) => {
                console.error("Nie udało się ustawić głośności:", err);
            });
        }, 500),
        [spotifyApi]
    );

    useEffect(() => {
        if (volume >= 0 && volume <= 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume, debouncedAdjustVolume]);

    return (
        <div className="h-20 bg-gradient-to-br from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-5">
            <div className="flex items-center space-x-4">
                <img
                    className="image hidden md:inline"
                    src={songInfo?.album.images?.[0]?.url}
                    alt=""
                />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />

                {isPlaying ? (
                    <PauseIcon
                        onClick={handlePlayPause}
                        className="button w-10 h-10"
                    />
                ) : (
                    <PlayIcon
                        onClick={handlePlayPause}
                        className="button w-10 h-10"
                    />
                )}

                <FastForwardIcon className="button" />
                <ReplyIcon className="button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeUpIcon
                    onClick={() => volume > 0 && setVolume(volume - 10)}
                    className="sound"
                />
                <input
                    className="w-14 md:w-28"
                    type="range"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0}
                    max={100}
                />
                <VolumeDownIcon
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                    className="sound"
                />
            </div>
        </div>
    );
}

export default Player;
