import Navbar from "../global/Navbar"
import Footer from "../global/Footer"

import PageSection from "../global/PageSection"

import OtherYears from "@/components/officers/OtherYears"
import Officers from "@/app/officers/Officers"
import { GetAllYears, GetOfficerYear } from "@/lib/officers"

export default async function OfficerPage({ schoolYear }: { schoolYear: string }) {
  const isCurrentYear = schoolYear === "current";

  const officerYear = await GetOfficerYear(schoolYear);

  if (!officerYear) return <div>Loading...</div>

  const currentYearSubtext = "We're a growing body of talented individuals with a passion for making game development exciting in every way. Hover over each profile!";

  const otherSchoolYears = await GetAllYears(schoolYear);

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      <PageSection
        heading={isCurrentYear ? "Our Team" : `${schoolYear} Officers`}
        subText={isCurrentYear ? currentYearSubtext : officerYear.excerpt}
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
