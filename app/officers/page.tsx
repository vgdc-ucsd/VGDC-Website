import OfficerPage from "@/components/officers/OfficerPage"
import { SchoolYear } from "@/lib/officers"

export default async function Officers() {
  const schoolYear: SchoolYear = { type: "current", value: "currentYear" }
  return <OfficerPage schoolYear={schoolYear} />
}
