"use server"

import Link from "next/link"

import { getSheetData } from "@/lib/google-sheets.action"

import { useState, useMemo, useEffect } from "react"

type EventType = {
  data: any[][]
}

export default async function EventList() {
  const getEvents = async () => {
    const response = await getSheetData()

    let eventList = []

    if (response.data != null && response.data != undefined) {
      for (let i in response.data) {
        let event = {
          title: response.data[i][0],
          description: response.data[i][1],
          location: response.data[i][2],
          date: response.data[i][3],
          time: response.data[i][4] + " - " + response.data[i][5],
          image: response.data[i][6],
        }

        if (response.data[i][7] == "TRUE") eventList.push(event)
      }
    }

    return eventList
  }

  const events = await getEvents()

  return (
    <div className="mx-auto mb-32 mt-32 w-full px-4 sm:w-[600px] sm:px-8 md:w-[680px] lg:w-[800px]">
      <div className="mb-6 text-left">
        <h2 className="mb-2 text-xl font-bold text-white lg:text-3xl">
          Explore Events
        </h2>
        <Link
          href="./"
          className="text-text-grey transition-all hover:text-white"
        >{`View more events ->`}</Link>
      </div>
      <div className="space-y-6">
        {events.map((event) => {
          console.log(event.title)
          return (
            <Event
              title={event.title}
              description={event.description}
              date={event.date}
              time={event.time}
              location={event.location}
              image={event.image}
            />
          )
        })}
      </div>
    </div>
  )
}

function Event({ title, location, date, time, description, image }: any) {
  return (
    <div className="flex rounded-3xl bg-footer-grey p-3 align-middle sm:space-x-6 sm:p-6">
      <img
        src={`${image}`}
        className="hidden w-40 rounded-xl sm:block md:w-48"
      />
      <div className="relative w-full">
        <div className="mb-2 md:mt-2">
          <h3 className="text-xl font-semibold text-text-white">{title}</h3>
          <h4 className="text-md font-semibold text-vgdc-light-green">
            {location}
          </h4>
          <h4 className="text-md font-semibold text-vgdc-light-green lg:hidden">
            {date} @ {time}
          </h4>
        </div>
        <p className="hidden w-full text-sm text-text-grey sm:block md:hidden">
          {truncate(description, 120, true)}
        </p>
        <p className="w-full text-sm text-text-grey sm:hidden md:block md:w-80 lg:w-96 lg:leading-6">
          {truncate(description, 200, true)}
        </p>
        <h4 className="invisible absolute right-2 text-right font-semibold text-text-grey lg:visible lg:top-2">
          {date}
          <br />
          {time}
        </h4>
        <button className="bottom-0 right-0 mt-4 h-10 w-28 rounded-lg bg-background-grey text-sm text-text-white transition-colors sm:absolute sm:right-auto md:bottom-2">
          Event Details
        </button>
      </div>
    </div>
  )
}

function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) {
    return str
  }
  const subString = str.slice(0, n - 1) // the original check
  return (
    (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + "..."
  )
}
