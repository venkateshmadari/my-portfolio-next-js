'use client'

import React, { useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { sora_font } from "../preloader/Preloader"
import dynamic from 'next/dynamic'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

const Footer = () => {
  const [like, setLike] = useState(false)
  const [isConfettiActive, setIsConfettiActive] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLikeToggle = () => {
    setLike((prev) => !prev)
    if (!like) {
      setIsConfettiActive(true)
      setTimeout(() => setIsConfettiActive(false), 8000) 
    }
  }

  return (
    <div className="text-center mb-16 lg:mb-0">
      <h2
        className={`${sora_font.className} text-center capitalize flex items-center justify-center pb-2 lg:text-sm text-xs`}
      >
        made with
        <span className="px-1 cursor-pointer" onClick={handleLikeToggle}>
          {like ? (
            <FaHeart className="text-shade" />
          ) : (
            <FaRegHeart className="text-shade" />
          )}
        </span>
        by venkatesh
      </h2>
      {isConfettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            colors={['#ff0000', '#ff69b4', '#ff1493']} 
          />
        </div>
      )}
    </div>
  )
}

export default Footer