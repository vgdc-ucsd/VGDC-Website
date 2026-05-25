// @ts-nocheck
"use client"

import { useRef } from 'react'
import Script from 'next/script'

export default function WTTriggerErrorButton() {
  const wtRef = useRef(null)

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/cse110-sp26-group7/Watchtower@main/client/watchtower.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          wtRef.current = new window.Watchtower({ 
            projectId: "wt_demo",
            endpoint: "https://watchtower-ingest.cse110piedpiper7.workers.dev/ingest",
            environment: "prod"
          })
          wtRef.current.init()
        }}
      />
      <div className="flex justify-center pt-4">
        <button
          id="trigger-error"
          className="px-16 py-8 text-7xl bg-white border border-gray-300 rounded-3xl shadow"
          onClick={() => {
            const err = new Error("watchtower e2e test")
            wtRef.current?.captureError(err)
            throw err
          }}
        >
          Trigger Test Error
        </button>
      </div>
    </>
  )
}
