'use client'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";


export default function BackButton() {
    const router = useRouter();
    const appOrigin = typeof window !== "undefined" ? window.location.origin : "";

    return (
        <Button onClick={()=> {
            const isDirectNavigation = !document.referrer || !document.referrer.startsWith(appOrigin);
            
            if (window.history.length > 1 && !isDirectNavigation) {
                router.back();
            } else {
                router.push("/");
            }
        }}>Back</Button>
    )
}