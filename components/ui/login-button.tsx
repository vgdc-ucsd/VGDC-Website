"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function LoginButton(){
    const { data: session } = useSession();

    if(session){
        return ( 
            <DropdownMenu modal={false}> 
                <DropdownMenuTrigger asChild>
                    {/* maybe later add pfp and make the design better */}
                    <span>{session.user?.name || "User"}</span>
                </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[60]">
                    <Button onClick={() => signOut()} variant="outline"className="w-full sm:w-auto">
                        Sign Out
                    </Button>
                  </DropdownMenuContent>
            </DropdownMenu>
        ); 
    }

    return (
        <Button onClick={() => signIn("discord")} className="w-full sm:w-auto">
            Sign in with Discord
        </Button>
    );
}