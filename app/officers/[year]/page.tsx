
import OfficerPage from "@/components/officers/OfficerPage"
import { SchoolYear } from "@/lib/officers"

export default async function Officers({ params }: { params: Promise<{ year: string }> }) {
  const yearText = (await params).year
  const schoolYear: SchoolYear = { type: "year", value: yearText }
  return <OfficerPage schoolYear={schoolYear} />
}
