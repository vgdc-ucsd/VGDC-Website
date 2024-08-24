import { promises as fs } from "fs"

export default async function getOfficerData() {
  const file = await fs.readFile(
    process.cwd() + "/public/data/officers.json",
    "utf8"
  )
  const data = JSON.parse(file)

  return data
}
