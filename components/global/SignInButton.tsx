"use client"

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FaDiscord } from "react-icons/fa";

export default function SignInButton(
  { redirect, className = "" }: { redirect: string, className: string })
{
  return <Button
    onClick={() => signIn("discord", { callbackUrl: redirect })}
    className={"gap-3 " + className}
  >
    <FaDiscord size={24} className="inline-block" />
    Officer sign in
  </Button>
}
