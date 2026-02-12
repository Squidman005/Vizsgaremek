import { useEffect, useRef, useState } from "react"
import { decodeJWT } from "@/lib/decode-JWT"
import { axiosClient } from "@/lib/axios-client"
import { ScoreList } from "./ScoreList"

type TargetCircle = {
  x: number
  y: number
  radius: number
  color: "blue" | "purple" | "red"
  opacity: number
  fadeIn: boolean
  decayRate: number
}

export function AimLabGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [lastScore, setLastScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [canvasWidth, setCanvasWidth] = useState(800)

  const canvasHeight = 500
  const targets = useRef<TargetCircle[]>([])
  const spawnInterval = useRef(1600)
  const spawnTimer = useRef<number | null>(null)
  const difficultyTimer = useRef<number | null>(null)
  const hasPostedScore = useRef(false)

  const user = decodeJWT()?.user

  useEffect(() => {
    const updateCanvasWidth = () => {
      const maxWidth = window.innerWidth - 40
      setCanvasWidth(Math.min(maxWidth, 800))
    }
    updateCanvasWidth()
    window.addEventListener("resize", updateCanvasWidth)
    return () => window.removeEventListener("resize", updateCanvasWidth)
  }, [])

  const endGame = async () => {
    if (hasPostedScore.current) return
    hasPostedScore.current = true

    setIsGameOver(true)
    setIsGameRunning(false)
    if (spawnTimer.current) clearInterval(spawnTimer.current)
    if (difficultyTimer.current) clearInterval(difficultyTimer.current)

    try {
      const res = await axiosClient.post("http://localhost:5000/api/score", {
        score: currentScore,
        userId: user.username,
        gamename: "aimlab",
      })
      console.log("Score saved:", res.data)
      setLastScore(currentScore)
    } catch (err: any) {
      console.error("Failed to save score:", err.response?.data || err.message || err)
    }
  }

  useEffect(() => {
    if (!isGameRunning) return
    const context = canvasRef.current!.getContext("2d")!
    let animationId: number

    const spawnTarget = () => {
      if (targets.current.length >= 3) return

      const rand = Math.random()
      let color: TargetCircle["color"] = "blue"

      if (rand > 0.85) color = "purple"
      else if (rand > 0.65) color = "red"

      targets.current.push({
        x: Math.random() * (canvasWidth - 120) + 60,
        y: Math.random() * (canvasHeight - 120) + 60,
        radius: 32,
        color,
        opacity: 0,
        fadeIn: true,
        decayRate: 0.003,
      })
    }

    spawnTimer.current = window.setInterval(spawnTarget, spawnInterval.current)

    difficultyTimer.current = window.setInterval(() => {
      spawnInterval.current = Math.max(900, spawnInterval.current - 100)
      if (spawnTimer.current) {
        clearInterval(spawnTimer.current)
        spawnTimer.current = window.setInterval(spawnTarget, spawnInterval.current)
      }
    }, 8000)

    const gameLoop = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      context.fillStyle = "#111827"
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      targets.current.forEach((target) => {
        if (target.fadeIn) {
          target.opacity += target.decayRate
          if (target.opacity >= 1) target.fadeIn = false
        } else {
          target.opacity -= target.decayRate
        }

        context.globalAlpha = Math.max(0, Math.min(1, target.opacity))
        context.fillStyle =
          target.color === "blue"
            ? "#3B82F6"
            : target.color === "purple"
            ? "#A855F7"
            : "#EF4444"

        context.beginPath()
        context.arc(target.x, target.y, target.radius, 0, Math.PI * 2)
        context.fill()
      })

      context.globalAlpha = 1

      targets.current = targets.current.filter((t) => {
        if (t.opacity <= 0) {
          if (t.color === "blue") {
            setLives((l) => {
              if (l - 1 <= 0) {
                endGame()
                return 0
              }
              return l - 1
            })
          }
          return false
        }
        return true
      })

      context.fillStyle = "white"
      context.font = "18px Arial"
      context.textAlign = "left"
      context.fillText(`Score: ${currentScore}`, 16, 28)
      context.fillText(`Lives: ${lives}`, 16, 52)

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()
    return () => cancelAnimationFrame(animationId)
  }, [isGameRunning, currentScore, lives, canvasWidth])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isGameRunning) {
      startGame()
      return
    }

    const rect = canvasRef.current!.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    targets.current = targets.current.filter((target) => {
      const dist = Math.hypot(clickX - target.x, clickY - target.y)
      if (dist <= target.radius) {
        if (target.color === "blue") setCurrentScore((s) => s + 1)
        if (target.color === "purple") setCurrentScore((s) => s + 3)
        if (target.color === "red") {
          setCurrentScore((s) => s - 1)
          setLives((l) => {
            if (l - 1 <= 0) {
              endGame()
              return 0
            }
            return l - 1
          })
        }
        return false
      }
      return true
    })
  }

  const startGame = () => {
    targets.current = []
    spawnInterval.current = 1600
    hasPostedScore.current = false
    setLives(3)
    setCurrentScore(0)
    setIsGameOver(false)
    setIsGameRunning(true)
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full px-4">
      <div className="relative w-full" style={{ maxWidth: canvasWidth }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          className="border border-gray-400 w-full rounded"
        />

        {!isGameRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            {isGameOver && (
              <p className="text-3xl text-white font-bold mb-4">
                Game Over! Score: {lastScore}
              </p>
            )}
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              onClick={startGame}
            >
              {isGameOver ? "Restart Game" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      <ScoreList
        gamename="aimlab"
        title="Aim Lab"
        controls="Click / Tap"
        description="Click on the blue and purple circles to gain points, don't click on the red ones"
        refreshKey={lastScore}
      />
    </div>
  )
}
