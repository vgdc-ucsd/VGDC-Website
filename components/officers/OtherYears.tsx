import { GetAllYears } from "@/lib/officers"
import Link from "next/link"

export default function OtherYears({
  otherYears,
}: {
  otherYears: string[]
}) {
  return (
    <div className="text-text-white">
      <h2 className="mb-2 mt-2 text-3xl font-medium">Other Years</h2>
      {otherYears.map((year) => {
        return (
          <Link
            href={`/officers${year != "current" ? "/" + year : ""}`}
            className="block text-text-grey transition-all hover:text-white"
            key={year}
          >
            {value.link}
          </Link>
        )
      })}
    </div>
  )
}
