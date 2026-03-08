import { getStoredImageUrl } from "./images"
import { prisma } from "./prisma"
import { Result } from "./utils"

/** The details of a showcase game from the spreadsheet. */
export type StoreItemDetails = {
  name: string
  price: string
  description: string
  image: string
  stock: boolean
}

export async function getStoreItems(): Promise<Result<StoreItemDetails[]>> {
  try {
    const storeItems = await prisma.storeItem.findMany();

    if (!storeItems) return { ok: false, error: "Failed to get store items" }

    const storeItemDetailsPromises = storeItems.map(async (item) => {
      const itemImage = item.image 
        ? await getStoredImageUrl(item.image)
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

    return {
      ok: true,
      data: await Promise.all(storeItemDetailsPromises)
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Internal server error" }
  }
}
