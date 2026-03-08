import Navbar from "../global/Navbar"
import Footer from "../global/Footer"

import PageSection from "../global/PageSection"

import OtherYears from "@/components/officers/OtherYears"
import Officers from "@/app/officers/Officers"
import { currentYearExcerpt, currentYearHeaderText, getAllYears, getOfficerYear, SchoolYear } from "@/lib/officers"
import { notFound } from "next/navigation"

export default async function OfficerPage({ schoolYear } : { schoolYear: SchoolYear }) {
  const isCurrentYear = schoolYear.type === "current";

  const result = await getOfficerYear(schoolYear);
  if (!result.ok) notFound();
  const officerYear = result.data;

  if (!officerYear) return <div>Loading...</div>

  const otherSchoolYears = await getAllYears(schoolYear);
  
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      <PageSection
        heading={isCurrentYear ? currentYearHeaderText : `${schoolYear.value} Officers`}
        subText={isCurrentYear ? currentYearExcerpt : officerYear.excerpt}
        backButton={!isCurrentYear ? { text: "<- back", href: "/officers" } : undefined}
      >
        <div className="space-y-20">
          <Officers officers={officerYear.officerDetails} />
          <OtherYears otherYears={otherSchoolYears} />
        </div>
      </PageSection>

      <Footer />
    </main>
  )
}
