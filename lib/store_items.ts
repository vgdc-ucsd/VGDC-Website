import { prisma } from "./prisma"

/** The details of a showcase game from the spreadsheet. */
export type StoreItemDetails = {
  name: string
  price: string
  description: string
  image: string
  stock: boolean
}

export async function getStoreItems() {
  const storeItems = await prisma.storeItem.findMany();

  for (let i = 0; i < storeItems.length; ++i) {
    console.log(storeItems[i].image);
  }

  return storeItems.map((item) => ({
    name: item.name,
    price: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(item.price.toNumber()),
    description: item.description,
    image: item.image,
    stock: item.stock > 0,
  }));
}
