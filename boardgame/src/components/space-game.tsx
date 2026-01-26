import { useEffect, useRef, useState } from "react"
import { decodeJWT } from "@/lib/decode-JWT"
import { axiosClient } from "@/lib/axios-client"
import { ScoreList } from "./ScoreList"

type Asteroid = {
  x: number
  y: number
  size: number
  speed: number
}

type Gold = {
  x: number
  y: number
  size: number
  speed: number
}

export function SpaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [lastScore, setLastScore] = useState(0)
  const [canvasWidth, setCanvasWidth] = useState(400)
  const [refreshKey, setRefreshKey] = useState(0)
  const canvasHeight = 700
  const spaceshipSize = 40
  const spaceshipSymbol = "🚀"
  const spaceshipHitbox = 24
  const moveRef = useRef({ left: false, right: false })
  const spaceship = useRef({ x: 200, y: canvasHeight - 60, velocity: 0 })
  const asteroidsRef = useRef<Asteroid[]>([])
  const goldsRef = useRef<Gold[]>([])
  const user = decodeJWT()?.user

  useEffect(() => {
    const updateCanvasWidth = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 400)
      setCanvasWidth(maxWidth)
      spaceship.current.x = maxWidth / 2
    }
    updateCanvasWidth()
    window.addEventListener("resize", updateCanvasWidth)
    return () => window.removeEventListener("resize", updateCanvasWidth)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveRef.current.left = true
      if (e.key === "ArrowRight") moveRef.current.right = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") moveRef.current.left = false
      if (e.key === "ArrowRight") moveRef.current.right = false
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const postScore = async (score: number) => {
    try {
      await axiosClient.post("http://localhost:5000/api/score", {
        score,
        userId: user.username,
        gamename: "spacegame",
      })
    } catch {}
  }

  const endGame = () => {
    setIsGameOver(true)
    setLastScore(currentScore)
    setIsGameRunning(false)
    postScore(currentScore).finally(() => setRefreshKey(prev => prev + 1))
  }

  const startGame = () => {
    spaceship.current = { x: canvasWidth / 2, y: canvasHeight - 60, velocity: 0 }
    asteroidsRef.current = []
    goldsRef.current = []
    setCurrentScore(0)
    setIsGameOver(false)
    setIsGameRunning(true)
  }

  useEffect(() => {
    if (!isGameRunning) return
    const context = canvasRef.current!.getContext("2d")!
    let animationId: number
    let asteroidTimer = 0
    let goldTimer = 0

    const gameLoop = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      context.fillStyle = "#000000"
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      if (!isGameOver) {
        if (moveRef.current.left) spaceship.current.velocity -= 0.5
        if (moveRef.current.right) spaceship.current.velocity += 0.5
        spaceship.current.velocity *= 0.9
        spaceship.current.x += spaceship.current.velocity
        if (spaceship.current.x < 0) spaceship.current.x = 0
        if (spaceship.current.x > canvasWidth) spaceship.current.x = canvasWidth

        context.save()
        context.translate(spaceship.current.x, spaceship.current.y)
        context.rotate((-45 * Math.PI) / 180)
        context.textAlign = "center"
        context.fillText(spaceshipSymbol, 0, 0)
        context.restore()

        asteroidTimer++
        if (asteroidTimer > 60) {
          asteroidTimer = 0
          asteroidsRef.current.push({
            x: Math.random() * (canvasWidth - 20),
            y: -20,
            size: 15 + Math.random() * 15,
            speed: 1.5 + Math.random() * 1.5
          })
        }

        goldTimer++
        if (goldTimer > 120) {
          goldTimer = 0
          goldsRef.current.push({
            x: Math.random() * (canvasWidth - 12),
            y: -12,
            size: 12,
            speed: 1 + Math.random() * 1
          })
        }

        asteroidsRef.current.forEach(a => {
          a.y += a.speed
          context.fillStyle = "gray"
          context.beginPath()
          context.arc(a.x, a.y, a.size, 0, Math.PI * 2)
          context.fill()
          if (
            spaceship.current.x + spaceshipHitbox / 2 > a.x - a.size &&
            spaceship.current.x - spaceshipHitbox / 2 < a.x + a.size &&
            spaceship.current.y + spaceshipHitbox / 2 > a.y - a.size &&
            spaceship.current.y - spaceshipHitbox / 2 < a.y + a.size
          ) endGame()
        })
        asteroidsRef.current = asteroidsRef.current.filter(a => a.y < canvasHeight)

        goldsRef.current.forEach((g, idx) => {
          g.y += g.speed
          context.fillStyle = "gold"
          context.beginPath()
          context.arc(g.x, g.y, g.size, 0, Math.PI * 2)
          context.fill()
          if (
            spaceship.current.x + spaceshipHitbox / 2 > g.x - g.size &&
            spaceship.current.x - spaceshipHitbox / 2 < g.x + g.size &&
            spaceship.current.y + spaceshipHitbox / 2 > g.y - g.size &&
            spaceship.current.y - spaceshipHitbox / 2 < g.y + g.size
          ) {
            setCurrentScore(prev => prev + 1)
            goldsRef.current.splice(idx, 1)
          }
        })
        goldsRef.current = goldsRef.current.filter(g => g.y < canvasHeight)
      }

      context.fillStyle = "white"
      context.font = "24px Arial"
      context.textAlign = "center"
      context.fillText(`Score: ${currentScore}`, canvasWidth / 2, 30)

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()
    return () => cancelAnimationFrame(animationId)
  }, [isGameRunning, isGameOver, canvasWidth, currentScore])

  return (
    <div className="flex flex-col items-center gap-2 w-full px-4">
      <div className="relative" style={{ maxWidth: canvasWidth }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-400"
        />
        {!isGameRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700/50">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              onClick={startGame}
            >
              {isGameOver ? "Restart Game" : "Start Game"}
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2 justify-center">
        <button
          className="w-12 h-12 rounded-full bg-gray-800 text-white text-2xl flex items-center justify-center"
          onMouseDown={() => moveRef.current.left = true}
          onMouseUp={() => moveRef.current.left = false}
          onTouchStart={() => moveRef.current.left = true}
          onTouchEnd={() => moveRef.current.left = false}
        >
          ◀
        </button>
        <button
          className="w-12 h-12 rounded-full bg-gray-800 text-white text-2xl flex items-center justify-center"
          onMouseDown={() => moveRef.current.right = true}
          onMouseUp={() => moveRef.current.right = false}
          onTouchStart={() => moveRef.current.right = true}
          onTouchEnd={() => moveRef.current.right = false}
        >
          ▶
        </button>
      </div>
      <ScoreList
        key={refreshKey}
        gamename="spacegame"
        title="Space Game"
        controls="Arrow keys or buttons to move left/right"
        description="Dodge asteroids, collect gold, and get the highest score possible"
      />
    </div>
  )
}
