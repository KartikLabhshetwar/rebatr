"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rotation: number
  rotationSpeed: number
  size: number
}

interface ConfettiProps {
  trigger: boolean
  duration?: number
  particleCount?: number
}

export function Confetti({ trigger, duration = 3000, particleCount = 100 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ]

  useEffect(() => {
    if (!trigger) return

    setIsActive(true)

    // Create confetti pieces
    const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 8 + 4,
    }))

    setPieces(newPieces)

    // Animation loop
    const animate = () => {
      setPieces((prevPieces) =>
        prevPieces
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vy: piece.vy + 0.3, // gravity
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter((piece) => piece.y < window.innerHeight + 50),
      )
    }

    const animationId = setInterval(animate, 16) // ~60fps

    // Clean up after duration
    const timeout = setTimeout(() => {
      setIsActive(false)
      setPieces([])
      clearInterval(animationId)
    }, duration)

    return () => {
      clearInterval(animationId)
      clearTimeout(timeout)
    }
  }, [trigger, duration, particleCount])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 opacity-90"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.size / 6})`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  )
}
