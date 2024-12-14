import Navbar from "../global/Navbar"
import Footer from "../global/Footer"

import { PageComponent, PageHeader } from "../global/PageComponents"

import OtherYears from "@/components/officers/OtherYears"
import Officers from "@/app/officers/Officers"
import data from "@/public/data/officers.json"

export default async function OfficerPage({ year }: { year: string }) {

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />

      <PageComponent>
        <div className="space-y-20">
          <PageHeader
            heading={data[year as keyof typeof data]!.heading!}
            subheading="<- back"
            paragraph={data[year as keyof typeof data]!.paragraph!}
            href="./"
            flip={true}
          />

          <Officers officers={data[year as keyof typeof data]!.officers!} />

          <OtherYears data={data} exclude={year} />
        </div>
      </PageComponent>

      <Footer />
    </main>
  )
}
