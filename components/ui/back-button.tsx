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
                console.log("here");
                router.back();
            } else {
                console.log("o rhere");
                router.push("/");
            }
        }}>Back</Button>
    )
}