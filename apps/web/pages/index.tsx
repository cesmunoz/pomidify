import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Web() {
  const { data: session } = useSession();
  // const [playlists, setPlaylists] = useState([]);

  // const getUserPlaylists = async () => {
  //   const res = await fetch("/api/playlists");
  //   const { items } = await res.json();
  //   setPlaylists(items);
  // };

  if (session) {
    return (
      <>
        <h1>Dashboard</h1>
        {/* {playlists.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <img src={item.images[0]?.url} width="100" />
          </div>
        ))} */}
      </>
    );
  }

  return (
    <>
      Not signed in <br />
    </>
  );
}
