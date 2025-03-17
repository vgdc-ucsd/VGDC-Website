import { getSheetData } from "./google-sheets.action"

/** The details of a showcase game from the spreadsheet. */
export type ShowcaseGamesDetails = {
  title: string
  releaseDate: string
  difficulty: number
  description: string
  credits: string
  link: string
  status: boolean
  image: string
  theme: string
  vgdcApproved: boolean
  web: boolean
}

/**
 * Gets the showcase game details from a spreadsheet.
 * @param includeIncompleteGames Include incomplete games? True by default.
 * @returns List of showcase games details.
 */
export async function getShowcaseGames() {
  // Gets the raw data from getSheetData.
  const response = await getSheetData("Games")

  // The list that showcase games will be added to.
  let gamesList = []

  // As long as event data is present...
  if (response.data != undefined && response.data != null) {
    // Iterate through every event.
    for (let i in response.data) {
        if(response.data[i][0] == "") continue

        // Get the details for the event.
        let event: ShowcaseGamesDetails = {
            title: response.data[i][0],
            releaseDate: response.data[i][1],
            difficulty: response.data[i][2],
            description: response.data[i][3],
            credits: response.data[i][4],
            link: response.data[i][5],
            status: response.data[i][6] === "TRUE",
            image: response.data[i][7],
            theme: response.data[i][8],
            vgdcApproved: response.data[i][9] === "TRUE",
            web: response.data[i][10] === "TRUE"
        }

        gamesList.push(event)
    }
  }

  // Return the completed list.
  return gamesList
}
