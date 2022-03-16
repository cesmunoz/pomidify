import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "ui";
import { SidebarWithHeader } from "../components/Layout";

export default function Web() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);

  const getUserPlaylists = async () => {
    const res = await fetch("/api/playlists");
    const { items } = await res.json();
    setPlaylists(items);
  };

  if (session) {
    return (
      <SidebarWithHeader>
        Hello World Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={() => getUserPlaylists()}>Get all my playlists</button>
        {playlists.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <img src={item.images[0]?.url} width="100" />
          </div>
        ))}
      </SidebarWithHeader>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
