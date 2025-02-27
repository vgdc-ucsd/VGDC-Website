"use client"

import React from 'react'
import { ShowcaseItem } from '@/lib/showcase'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

type GameCardProps = {
  game: ShowcaseItem
  onClick: () => void
  getStatusText: (status: boolean | number) => string
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick, getStatusText }) => {
  return (
    <div 
      className="group cursor-pointer perspective-1000 transform-gpu transition-all duration-500 hover:scale-105"
      onClick={onClick}
    >
      {/* Box Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gradient-to-r from-background-black to-footer-grey shadow-lg">
        {/* Game Cover Image */}
        <div className="h-3/4 w-full overflow-hidden">
          {game.image ? (
            <div 
              className="h-full w-full" 
              style={{
                backgroundImage: `url(${game.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-background-black">
              <p className="text-center text-gray-400">No image</p>
            </div>
          )}
        </div>
        
        {/* Game Information - Bottom Info */}
        <div className="absolute bottom-0 w-full bg-footer-grey p-3">
          <h3 className="mb-1 text-base font-bold text-white line-clamp-1">{game.title}</h3>
          
          <div className="mb-2 flex flex-wrap gap-1">
            <span className={`rounded-full ${getStatusText(game.status) === "Released" ? "bg-green-500" : "bg-yellow-500"} px-2 py-0.5 text-xs text-white`}>
              {getStatusText(game.status)}
            </span>
            
            {game.web && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                Web
              </span>
            )}
          </div>
          
          <p className="text-xs text-gray-300 line-clamp-2">{game.description}</p>
        </div>
      </div>
    </div>
  )
}

export default GameCard