import OfficerPage from "@/components/officers/OfficerPage"
import { SchoolYear } from "@/lib/officers"

export default function Officers() {
  const schoolYear: SchoolYear = { type: "year", value: "2025-2026" }
  return <OfficerPage schoolYear={schoolYear} />
}
