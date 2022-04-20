import { ChevronDownIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "../components/Songs";

const colors = [
    "from-red-500",
    "from-orange-500",
    "from-yellow-500",
    "from-green-500",
    "from-blue-500",
    "from-pink-500",
    "from-purple-500",
    "from-indigo-500",
];

function Center() {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body);
        }).catch((err) => {
            console.log("Coś poszło nie tak :(", err);
        })
    }, [spotifyApi, playlistId]);

    console.log(playlist);

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide text-white">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-gray-900 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-0 pr-2 text-white"
                 onClick={signOut}>
                    <img className="rounded-full w-10 h-10"
                    src={session?.user.image}
                    alt=""
                    />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80dd text-white p-10`}>
                <img 
                className="h-60 w-60 shadow-2xl" 
                src={playlist?.images?.[0]?.url}
                alt="" />
                <div>
                    <h2 className="md:text-xl xl:text-2xl">PLAYLISTA</h2>
                    <h1 className="text-2xl md:text-3xl xl:text-6xl font-bold">{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center