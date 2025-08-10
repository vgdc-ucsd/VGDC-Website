import Navbar from "../global/Navbar"
import Footer from "../global/Footer"

import PageSection from "../global/PageSection"

import OtherYears from "@/components/officers/OtherYears"
import Officers from "@/app/officers/Officers"
import data from "@/public/data/officers.json"

export default async function OfficerPage({ year }: { year: string }) {

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      <PageSection
        heading={data[year as keyof typeof data]!.heading!}
        subText={data[year as keyof typeof data]!.paragraph!}
      >
        <div className="space-y-20">
          <Officers officers={data[year as keyof typeof data]!.officers!} />
          <OtherYears data={data} exclude={year} />
        </div>
      </PageSection>

      <Footer />
    </main>
  )
}
