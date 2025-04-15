import { getSheetData } from "./google-sheets.action"

/** The details of a showcase game from the spreadsheet. */
export type StoreItemDetails = {
  //
}

export async function getStoreItems() {
  // temp store items
  let storeItems = [
    {
      name: "shirt",
      price: "$24.00",
      image:
        "https://plus.unsplash.com/premium_photo-1667520043080-53dcca77e2aa?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "pants",
      price: "$60.00",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1320&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "socks",
      price: "$30.00",
      image:
        "https://plus.unsplash.com/premium_photo-1661775820832-f971657b13f6?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "underwear",
      price: "$1.00",
      image:
        "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "stickers",
      price: "$100.00",
      image:
        "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?q=80&w=1312&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]
  return storeItems
}
