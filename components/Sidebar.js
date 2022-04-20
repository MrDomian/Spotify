import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
    AcademicCapIcon,
} from "@heroicons/react/solid";
import { signOut, useSession} from "next-auth/react"
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status} = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    console.log("Wybrałeś playliste: >>> ", playlistId)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
            })
        }
    }, [session, spotifyApi])

    console.log(playlists)
    console.log(session);
    return (
        <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-24">
            <div className="space-y-4">
                <button className="flex items-center text-left space-x-2 hover:text-white text-gray-500">
                    <AcademicCapIcon className="h-5 w-5 text-white"/>
                    <p>Spotify w Next.js</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                <button className="flex items-center text-left space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5 text-pink-500"/>
                    <p>Strona główna</p>
                </button>
                <button className="flex items-center text-left space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5 text-rose-500"/>
                    <p>Szukaj</p>
                </button>
                <button className="flex items-center text-left space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5 text-yellow-500"/>
                    <p>Biblioteka</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                <button className="flex items-center text-left space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5 text-blue-500"/>
                    <p>Utwórz playlistę</p>
                </button>
                <button className="flex items-center text-left space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5 text-purple-500"/>
                    <p>Polubione utwory</p>
                </button>
                <button className="flex items-center text-left space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5 text-green-500"/>
                    <p>Wydarzenia</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                {/* Playlists */}
                {playlists.map((playlist) => (
                    <p key={playlist.id}
                        onClick={() => setPlaylistId(playlist.id)}
                        className="cursor-pointer hover:text-white"
                    >
                    {playlist.name}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
