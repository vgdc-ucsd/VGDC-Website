import { getSheetData } from "./google-sheets.action"

/** The details of a showcase game from the spreadsheet. */
export type StoreItemDetails = {
  name: string
  price: string
  image1: string
  image2?: string
  stock: boolean
}

export async function getStoreItems() {
  const response = await getSheetData("Store")

  let storeItems = []
  
  if (response.data != undefined && response.data != null) {
    for (let i in response.data) {
        if(response.data[i][0] == "") continue

        // Get the details for the event.
        let storeItem: StoreItemDetails = {
            name: response.data[i][0],
            price: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(response.data[i][1]),
            image1: response.data[i][2],
            image2: response.data[i][3] || null,
            stock: response.data[i][4] === "TRUE",
        }

        storeItems.push(storeItem)
    }
  }
  
  return storeItems
}
