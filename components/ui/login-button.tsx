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
import { useState, useEffect } from "react";

export default function LoginButton() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Close dropdown when window is resized to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (session) {
    const userName = session.user?.name || "User";
    const userImage = session.user?.image ?? undefined;
    const initials = userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <>
        {/* Desktop View - Dropdown */}
        {/* we love hamburgerrr */}
        <div className="hidden md:block">
          <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:text-gray-600 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-white text-black text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-text-grey text-lg font-light">{userName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              sideOffset={8}
              className="z-[60] bg-black border-white/20 min-w-[100px] p-1">
              <DropdownMenuItem  
                onClick={() => signOut()}
                className=" cursor-pointer text-text-grey hover:text-gray-600 transition-colors text-sm font-light focus:text-gray-600 focus:bg-transparent items-center text-center justify-center">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile View*/}
        <div className="flex md:hidden items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-white text-black text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-text-grey text-lg font-light">{userName}</span>
          <Button
            onClick={() => signOut()}
            variant="outline"
            size="sm"
            className="ml-auto bg-black text-text-grey border-white/20 hover:text-gray-600 hover:bg-black"
          >
            Sign Out
          </Button>
        </div>
      </>
    );
  }

  return (
    <Button 
      onClick={() => signIn("discord")} 
      variant="outline"
      className="w-full md:w-auto bg-black text-text-grey border-white/20 hover:text-gray-600 hover:bg-black"
    >
      Sign in with Discord
    </Button>
  );
}