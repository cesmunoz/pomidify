/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Badge } from "ui";
import { useAppContext } from "../context/app";

export default function Spotify() {
  const { spotifySelectedPlaylist, setSpotifyPlaylist } = useAppContext();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    async function getUserPlaylists() {
      const res = await fetch("/api/playlists");
      const { items } = await res.json();
      setPlaylists(items);
    }
    getUserPlaylists();
  }, []);

  const handleClick = (item: any) => {
    const { id, uri } = item;
    setSpotifyPlaylist({
      id,
      uri,
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      {playlists.map((item) => {
        const selected = spotifySelectedPlaylist?.id === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`flex max-w-sm flex-col items-center overflow-hidden rounded-lg border p-5 ${
              selected ? "bg-pink-600" : "bg-white"
            }`}
            onClick={() => handleClick(item)}
          >
            <span
              className={`font-mono text-base font-bold ${
                selected ? "text-white" : "text-black"
              }`}
            >
              {item.name}
            </span>
            <img
              className="h-[200px] w-[400px] object-cover"
              src={item.images[0]?.url}
              alt={item.name}
            />
            {selected && (
              <Badge className="m-2" variant="default">
                SELECTED
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
