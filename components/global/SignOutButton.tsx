"use client"

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignOutButton(
  { redirect = "/", className = "" }: { redirect: string, className: string }
) {
  return <Button
    onClick={() => signOut({ callbackUrl: redirect })}
    className={"gap-3 " + className}
  >
    Sign out
  </Button>
}
