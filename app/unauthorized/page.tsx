import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";
import SignInButton from "@/components/global/SignInButton";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next";

export default async function UnauthorizedPage({ searchParams }: {
  searchParams:
  Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams;
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[920px] items-center justify-center px-8">
        <div className="w-full max-w-md rounded-lg border border-white/20 bg-background-grey p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-6 text-text-grey">
            You must be signed in with a Discord account that has officer permissions to access this page.
          </p>
          {session ?
            <Link href="/">
              <Button> Home </Button>
            </Link>
            : <SignInButton redirect={query.redirect as string} />
          }
        </div>
      </div>
      <Footer />
    </main>
  )
}
