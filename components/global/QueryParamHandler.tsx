"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname, redirect } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import Confetti from "react-confetti"
import { motion } from "framer-motion"

// In seconds.
const NOTIFICATION_DURATION = 5

export default function QueryParamHandler() {
  const query = useSearchParams()
  const router = useRouter()
  const pathName = usePathname()

  const [windowSize, setWindowSize] = useState({
    width: 300,
    height: 300,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      })
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (query.get("error") == "Callback") {
      redirect(`${query.get("callbackUrl")}?error=AccessDenied`)
    } else if (query.get("error") == "AccessDenied") {
      const updatedQuery = new URLSearchParams(query.toString())
      updatedQuery.delete("error")
      const queryString = updatedQuery.toString()

      const { dismiss } = toast({
        title: "Sign in failed",
        description: "Make sure to use an account that is a VGDC Discord server member."
      })
      setTimeout(dismiss, NOTIFICATION_DURATION * 1000)

      const newUrl = `${pathName}${queryString ? "?" + queryString : ""}`
      router.replace(newUrl, { scroll: false })
    } else if (query.get("signIn") == "Success") {
      const updatedQuery = new URLSearchParams(query.toString())
      updatedQuery.delete("signIn")
      const queryString = updatedQuery.toString()
      const { dismiss } = toast({ title: "Signed in successfully" })
      setShowConfetti(true)

      setTimeout(() => {
        dismiss()
        setShowConfetti(false)
      }, NOTIFICATION_DURATION * 1000)

      const newUrl = `${pathName}${queryString ? "?" + queryString : ""}`
      router.replace(newUrl, { scroll: false })
    }
  }, [pathName, query])

  return showConfetti &&
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: NOTIFICATION_DURATION, ease: "easeIn" }}
    >
      <Confetti width={windowSize.width} height={windowSize.height * 0.5}/>
    </motion.div>
}
