import Link from "next/link"

export default function OtherYears({
  data,
  exclude,
}: {
  data: object
  exclude: string
}) {
  return (
    <div className="text-text-white">
      <h2 className="mb-2 mt-2 text-3xl font-medium">Other Years</h2>
      {Object.entries(data).map(([key, value]) => {
        if (key == exclude) return
        return (
          <Link
            href={`/officers${key != "current" ? "/" + key : ""}`}
            className="block text-text-grey transition-all hover:text-white"
            key={key}
          >
            {value.link}
          </Link>
        )
      })}
    </div>
  )
}
