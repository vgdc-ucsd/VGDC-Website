import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { redirect } from "next/navigation"

// TODO: Once role is exposed in the NextAuth session callback, add a check here:
// if (session.user.role !== "OFFICER" && session.user.role !== "EXEC") { show access denied }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/unauthorized?redirect=/dashboard`)
  }

  return <DashboardClient userName="Officer" />
}
