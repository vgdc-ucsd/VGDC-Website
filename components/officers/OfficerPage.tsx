import Navbar from "../global/Navbar"
import Footer from "../global/Footer"

import { PageComponent, PageHeader } from "../global/PageComponents"

import OtherYears from "@/components/officers/OtherYears"
import Officers from "@/app/officers/Officers"
import getOfficerData from "@/lib/officers"
import { useMemo } from "react"

export default async function OfficerPage({ year }: { year: string }) {
  const data = await getOfficerData()

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      <PageComponent>
        <div className="space-y-20">
          <PageHeader
            heading={data[year]!.heading!}
            subheading="<- back"
            paragraph={data[year]!.paragraph!}
            href="./"
            flip={true}
          />

          <Officers officers={data[year]!.officers!} />

          <OtherYears data={data} exclude={year} />
        </div>
      </PageComponent>

      <Footer />
    </main>
  )
}
