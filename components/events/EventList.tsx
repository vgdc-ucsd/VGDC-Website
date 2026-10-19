"use client"

import { useState } from "react"
import EventCard from "./EventCard"
import { EventDetails } from "@/lib/events"
import { EventInput } from "@/lib/schemas/event"
import { deleteEvent } from "@/lib/form-actions"
import EditModal, { EditModalState } from "../global/EditModal"
import EventForm from "../dashboard/forms/EventForm"

/** Returns a vertical list of events. */
export default function EventList({
  events,
  editable = false,
}: {
  events: EventDetails[]
  editable?: boolean
}) {
  const [modal, setModal] = useState<EditModalState<EventInput> | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function openModal(kind: "update" | "delete", item: EventInput) {
    setDeleteError(null)
    setModal({ kind, item })
  }

  async function onDelete(item: EventInput) {
    setDeleting(true)
    const result = await deleteEvent(item)
    setDeleting(false)
    if (!result.ok) {
      setDeleteError(result.error)
      return
    }
    setModal(null)
  }

  return <>
    <div className="space-y-6">
      {/* Display the events one by one. */}
      {events.length > 0 ? (
        events.map((event) => {
          return (
            <EventCard
              title={event.title}
              description={event.description}
              date={event.date}
              time={event.time}
              location={event.location}
              image={event.image}
              slug={event.slug}
              formValues={event.formValues}
              key={event.slug}
              editable={editable}
              openModal={openModal}
            />
          )
        })
      ) : (
        <h3 className="text-xl text-text-grey">
          No events found, check back again soon!
        </h3>
      )}
    </div>
    {
      editable && modal && <EditModal<EventInput>
        modal={modal}
        closeModal={() => setModal(null)}
        renderForm={(event: EventInput) => (
          <EventForm isUpdating initialValues={event} callback={() => setModal(null)} />
        )}
        getDeleteLabel={(event: EventInput) => event.name}
        deleting={deleting}
        deleteError={deleteError}
        onDelete={onDelete}
      />
    }
  </>
}
