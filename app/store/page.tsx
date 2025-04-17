import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import { getStoreItems } from "@/lib/store_items"
import StoreVendor from "./components/StoreVendor"

export default async function Store() {
  const storeData = await getStoreItems()

  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Merch!!
        </h1>
        <p className="mb-8 text-center text-sm text-gray-300">
          SO MUCH MERCH OH MY GOD
        </p>

        <StoreVendor data={storeData} />
      </div>
      <Footer />
    </main>
  )
}
