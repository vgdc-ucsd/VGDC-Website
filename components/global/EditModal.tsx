"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { Button } from "../ui/button"
import { IoClose } from "react-icons/io5"

export type EditModalState<T> =
  | { kind: "update", item: T }
  | { kind: "delete", item: T }

export default function EditModal<T>({
  modal,
  closeModal,
  renderForm,
  getDeleteLabel,
  deleting,
  deleteError,
  onDelete,
}: {
  modal: EditModalState<T> | null
  closeModal(): void
  renderForm(item: T): ReactNode
  getDeleteLabel(item: T): ReactNode
  deleting: boolean
  deleteError: string | null
  onDelete(item: T): void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modal) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [modal, closeModal])

  if (!modal) {
    return null
  }

  if (modal.kind === "update") {
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
            <IoClose size={20} className="text-white" />
          </Button>
          <div className="hide-scrollbar max-h-[90vh] overflow-y-auto">
            {renderForm(modal.item)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-12">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-96 overflow-hidden rounded-lg bg-background-grey shadow-xl"
      >
        <div className="hide-scrollbar flex max-h-[90vh] flex-col gap-8 overflow-y-auto p-4">
          <p className="text-sm text-white">
            Delete <span className="font-semibold">{getDeleteLabel(modal.item)}</span>? This can't be undone.
          </p>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="default" size="sm" onClick={closeModal} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(modal.item)} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
