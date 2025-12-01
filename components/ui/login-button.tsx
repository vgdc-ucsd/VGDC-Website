"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    const userName = session.user?.name || "User";
    const userImage = session.user?.image ?? undefined; // Convert null to undefined
    const initials = userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <>
        {/* Desktop View - Dropdown */}
        <div className="hidden sm:block">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-white text-black text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm">{userName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="z-[60] bg-black border-white/20 text-white"
            >
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="w-full cursor-pointer hover:bg-white/10"
                >
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile View - Inline */}
        <div className="flex sm:hidden items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-white text-black text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-sm">{userName}</span>
          <Button
            onClick={() => signOut()}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            Sign Out
          </Button>
        </div>
      </>
    );
  }

  return (
    <Button onClick={() => signIn("discord")} className="w-full sm:w-auto">
      Sign in with Discord
    </Button>
  );
}