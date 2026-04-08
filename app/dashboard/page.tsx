// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import Navbar from "@/components/global/Navbar"
// import Footer from "@/components/global/Footer"
import DashboardClient from "@/components/dashboard/DashboardClient"

// TODO: Once role is exposed in the NextAuth session callback, add a check here:
// if (session.user.role !== "OFFICER" && session.user.role !== "EXEC") { show access denied }

export default async function DashboardPage() {
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   return (
  //     <main className="min-h-screen bg-background-black">
  //       <Navbar />
  //       <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[920px] items-center justify-center px-8">
  //         <div className="w-full max-w-md rounded-lg border border-white/20 bg-background-grey p-8 text-center">
  //           <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
  //           <p className="mb-6 text-text-grey">
  //             You must be signed in with a Discord account that has officer permissions to access this page.
  //           </p>
  //           <a
  //             href="/api/auth/signin/discord"
  //             className="inline-block rounded-md border border-white/20 bg-black px-5 py-2 text-text-grey transition-colors hover:text-gray-400"
  //           >
  //             Sign in with Discord
  //           </a>
  //         </div>
  //       </div>
  //       <Footer />
  //     </main>
  //   )
  // }

  return <DashboardClient userName="Officer" />
}
