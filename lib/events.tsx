import { getSheetData } from "./google-sheets.action"
import moment from "moment"

/** The details of an event from the spreadsheet. */
export type EventDetails = {
  title: string
  description: string
  location: string
  date: string
  time: string
  timestamp: string
  image: string
  slug: string
}

/**
 * Gets the events from a spreadsheet, filters them, and sorts them.
 * @param homepage Only include events for the homepage? False by default.
 * @param includeOldEvents Include events that have already passed? False by default.
 * @returns The list of events, sorted and filtered.
 */
export async function getEvents(homepage = false, includeOldEvents = false) {
  // Gets the raw data from getSheetData.
  const response = await getSheetData()
  // Gets the current moment to filter out events before this time. Subtracts 2 hours so events show briefly after ending.
  const thisMoment = moment().subtract(2, "hours").format("YYYY-MM-DD HH:mm:ss")

  // The list that events will be added to.
  let eventList = []

  // As long as event data is present...
  if (response.data != undefined && response.data != null) {
    // Iterate through every event.
    for (let i in response.data) {
      // Get the details for the event.
      let event: EventDetails = {
        title: response.data[i][0],
        description: response.data[i][1],
        location: response.data[i][2],
        // Formats the date as "Fri, July 5th".
        date: moment(response.data[i][3]).format("ddd, MMMM Do"),
        time: response.data[i][4] + " - " + response.data[i][5],
        // Uses momentjs to get a standard timestamp for sorting.
        timestamp: moment(
          response.data[i][3] + " " + response.data[i][5],
          "M/D/YYYY h:mm A"
        ).format("YYYY-MM-DD HH:mm:ss"),
        image: response.data[i][6],
        slug: response.data[i][9],
      }

      // If on the homepage, filter out non-homepage events.
      if (response.data[i][7] == "FALSE" && homepage) continue
      // Filter out all events before the current time if chosen.
      if (event.timestamp < thisMoment && !includeOldEvents) continue
      // If neither filter activated, add the event to the list.
      eventList.push(event)
    }

    // Sort the events by timestamp, earliest event first.
    eventList.sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1
      else if (a.timestamp < b.timestamp) return -1
      return 0
    })
  }

  // Return the completed list.
  return eventList
}
