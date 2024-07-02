import { getSheetData } from "./google-sheets.action"

export type EventDetails = {
  title: string
  description: string
  location: string
  date: string
  time: string
  image: string
  slug: string
}

export async function getEvents(homepage = false) {
  const response = await getSheetData()

  let eventList = []

  if (response.data != undefined && response.data != null) {
    for (let i in response.data) {
      let event: EventDetails = {
        title: response.data[i][0],
        description: response.data[i][1],
        location: response.data[i][2],
        date: response.data[i][3],
        time: response.data[i][4] + " - " + response.data[i][5],
        image: response.data[i][6],
        slug: response.data[i][9],
      }

      if (response.data[i][7] == "TRUE" || !homepage) eventList.push(event)
    }
  }

  return eventList
}
