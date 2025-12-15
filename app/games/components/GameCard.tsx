"use client"

import { ShowcaseGamesDetails } from "@/lib/showcase_games"
import ApprovalSeal from "./ApprovalSeal"
import { motion } from "framer-motion"
import { GameStatusColor } from "./ShowcaseSearch"
import { Eye } from "lucide-react"

export type GameStatus = "Released" | "Unreleased"

type GameCardProps = {
  game: ShowcaseGamesDetails
  onClick: () => void
  getStatusText: (status: boolean) => GameStatus
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="perspective-1000 cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Box Container */}
      <motion.div
        className="relative w-full overflow-visible bg-gradient-to-r from-background-black to-footer-grey shadow-lg rounded-lg"
        initial={{ boxShadow: "0 0 0 0px rgba(0, 0, 0, 0)" }}
        animate={{
          boxShadow: isHovered
            ? "0 0 0 3px rgb(99, 193, 255)"
            : "0 0 0 0px rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Game Cover Image */}
        <div className="relative h-3/4 w-full overflow-visible">
          <div className="relative h-full w-full overflow-hidden rounded-t-lg">
            {game.image ? (
              <div
                className="aspect-square w-full"
                style={{
                  backgroundImage: `url(${game.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-background-black">
                <p className="text-center text-gray-400">No image</p>
              </div>
            )}

            {/* Click overlay on hover*/}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none rounded-t-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.3 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 8,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Eye className="h-12 w-12 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Approval Sticker */}
          {game.vgdcApproved && (
            <motion.div
              className="absolute -right-3 -top-5"
              style={{ overflow: "visible" }}
              animate={{
                rotate: [15, 12, 15],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <ApprovalSeal width={80} height={80} />
            </motion.div>
          )}
        </div>

        {/* Game Information - Bottom Info */}
        <div className="w-full rounded-b-lg bg-footer-grey p-3">
          {/* <div className="aspect-square w-full opacity-0"></div> */}
          <h3 className="mb-1 line-clamp-1 text-base font-bold text-white">
            {game.title}
          </h3>

          <div className="mb-2 flex flex-wrap gap-1">
            <span
              className={`rounded-full ${GameStatusColor[game.status]} px-2 py-0.5 text-xs text-white`}
            >
              {game.status}
            </span>

            {game.web && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                Web
              </span>
            )}
          </div>

          <p className="line-clamp-2 h-8 text-xs text-gray-300">
            {game.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameCard
