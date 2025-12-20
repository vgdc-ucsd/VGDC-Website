import { GetStoredImageUrl } from "./images"
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
  try {
    const storeItems = await prisma.storeItem.findMany();

    const storeItemDetailsPromises = storeItems.map(async (item) => {
      const itemImage = item.image 
        ? await GetStoredImageUrl(item.image)
        : "";
        return {
        name: item.name,
        price: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(item.price.toNumber()),
        description: item.description,
        image: itemImage,
        stock: item.stock > 0,
      } satisfies StoreItemDetails;
    });
    return await Promise.all(storeItemDetailsPromises);
  } catch (error) {
    console.error(error);
    return [];
  }
}
