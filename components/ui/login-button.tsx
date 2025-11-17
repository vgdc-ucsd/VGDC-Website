"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginButton(){
    const { data: session } = useSession();

    if(session){
        return ( 
            <div>
                {/* maybe later add pfp and make the design better */}
                <p>{session.user?.name}</p>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        );
    }

    return (
        <button onClick={() => signIn("discord")}>
            Sign in with Discord
        </button>
    );
}