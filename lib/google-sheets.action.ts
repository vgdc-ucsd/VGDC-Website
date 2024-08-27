"use server"
import { google } from "googleapis"

export async function getSheetData() {
  const glAuth = await google.auth.getClient({
    credentials: {
      type: "service_account",
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL,
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const glSheets = google.sheets({ version: "v4", auth: glAuth })

  try {
    const data = await glSheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "A4:Z",
    })
    return { data: data.data.values }
  } catch (e) {
    return { data: null }
  }
}
