"use client"

import { EventInput } from "@/lib/schemas/event"
import { useEffect, useRef } from "react"
import { Button } from "../ui/button"
import EventForm from "../dashboard/forms/EventForm"
import { IoClose } from "react-icons/io5"

export type EventEditModalState = { kind: "update" | "delete", formValues: EventInput }

export default function EventModal({
  modal,
  closeModal,
  deleting,
  deleteError,
  onDelete
}: {
  modal: EventEditModalState,
  closeModal(): void,
  deleting: boolean,
  deleteError: string | null,
  onDelete(): void,
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling of background content
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [closeModal])

  if (!modal) {
    return <></>
  } else if (modal.kind === "update") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-12">
        <div
          ref={modalRef}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-background-grey shadow-xl"
        >
          {/* Close button */}
          <Button
            onClick={closeModal}
            className="absolute right-6 top-6 z-20 px-2 aspect-square rounded-full text-white hover:bg-opacity-90"
          >
            <IoClose size={20} className="text-white"/>
          </Button>
          <div className="hide-scrollbar max-h-[90vh] overflow-y-auto">
            <EventForm isUpdating initialValues={modal.formValues} callback={closeModal} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-12">
        <div
          ref={modalRef}
          className="relative max-h-[90vh] w-full max-w-96 overflow-hidden rounded-lg bg-background-grey shadow-xl"
        >
          <div className="hide-scrollbar max-h-[90vh] overflow-y-auto p-4 flex flex-col gap-8">
            <p className="text-sm text-white">
              Delete <span className="font-semibold">{modal.formValues.name}</span>? This can't be undone.
            </p>
            {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="default" size="sm" onClick={closeModal} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
