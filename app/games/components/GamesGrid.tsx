"use client"

import { useState } from "react"
import { ShowcaseGamesDetails } from "@/lib/showcase_games"
import GameCard from "./GameCard"
import EditModal, { EditModalState } from "@/components/global/EditModal"
import GameForm from "@/components/dashboard/forms/GameForm"
import { deleteGame } from "@/lib/form-actions"

interface GameGridProps {
  gameData: ShowcaseGamesDetails[]
  setCurrentIndex(index: number): void
  setShowModal(isOpen: boolean): void
  editable?: boolean
}

export default function GamesGrid({
  gameData,
  setCurrentIndex,
  setShowModal,
  editable = false,
}: GameGridProps) {
  const [modal, setModal] = useState<EditModalState<ShowcaseGamesDetails> | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function openModal(kind: "update" | "delete", game: ShowcaseGamesDetails) {
    setDeleteError(null)
    setModal({ kind, item: game })
  }

  async function onDelete(game: ShowcaseGamesDetails) {
    setDeleting(true)
    const result = await deleteGame(game.id, game.formValues)
    setDeleting(false)
    if (!result.ok) {
      setDeleteError(result.error)
      return
    }
    setModal(null)
  }

  return (
    <>
      <div className="mx-auto grid max-w-fit grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {gameData.map((game, index) => (
          <div className="m-2 w-80 sm:w-56" key={game.id}>
            <GameCard
              game={game}
              getStatusText={(status) => (status ? "Released" : "Unreleased")}
              editable={editable}
              openModal={openModal}
              onClick={() => {
                setCurrentIndex(index)
                setShowModal(true)
              }}
            />
          </div>
        ))}
      </div>
      {editable && modal && (
        <EditModal<ShowcaseGamesDetails>
          modal={modal}
          closeModal={() => setModal(null)}
          renderForm={(game) => (
            <GameForm
              isUpdating
              id={game.id}
              initialValues={game.formValues}
              callback={() => setModal(null)}
            />
          )}
          getDeleteLabel={(game) => game.title}
          deleting={deleting}
          deleteError={deleteError}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
