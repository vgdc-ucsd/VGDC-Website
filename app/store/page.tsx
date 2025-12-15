import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import PageSection from "@/components/global/PageSection"
import { getStoreItems } from "@/lib/store_items"
import StoreVendor from "./components/StoreVendor"
import Link from "next/link"

export const revalidate = 60
const storeFormLink = "https://forms.gle/hbeMy1HY5LHC886L6";

export default async function Store() {
    const storeData = await getStoreItems()

    return (
        <main className="min-h-screen bg-background-black">
            <Navbar />
            <PageSection
                heading="Club Merch"
                subText={
                    <>
                        Browse our current merch collection! Click on any item to purchase or <Link href={storeFormLink} className="text-hot-pink">here</Link>.
                    </>
                }
            >
                <StoreVendor data={storeData} formLink={storeFormLink} />
            </PageSection>
            <Footer />
        </main>
    )
}
