import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import { getStoreItems } from "@/lib/store_items"
import StoreVendor from "./components/StoreVendor"
import Link from "next/link"

export const revalidate = 60

export default async function Store() {
  const storeData = await getStoreItems()

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Club Merch
        </h1>
        <p className="mb-4 text-center text-sm text-gray-300">
          Browse our current merch collection! Click on any item to purchase or <Link href="https://forms.gle/rmnewibtNA8utxMh7" className="text-hot-pink">here</Link>.
        </p>
        <StoreVendor data={storeData} />
      </div>
      <Footer />
    </main>
  )
}
