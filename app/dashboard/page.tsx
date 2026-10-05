import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!((session?.user as any)?.role == "officer")) {
    redirect(`/unauthorized?redirect=/dashboard`)
  }

  return <DashboardClient userName="Officer" />
}
