import { auth } from "@/lib/auth"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!((session?.user as any)?.role == "officer")) {
    redirect(`/unauthorized?redirect=/dashboard`)
  }

  return <DashboardClient userName="Officer" />
}
