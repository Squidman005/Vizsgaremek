import { useEffect, useRef, useState } from "react"
import { decodeJWT } from "@/lib/decode-JWT";
import { axiosClient } from "@/lib/axios-client"

type Pipe = {
  xPosition: number
  gapYPosition: number
  passed?: boolean
}

type FlappyBirdGameProps = {
  userName: string
}

export function FlappyBirdGame({ userName }: FlappyBirdGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [lastScore, setLastScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  const canvasHeight = 600
  const birdRadius = 15
  const gravityForce = 0.1
  const jumpForce = -3.2
  const pipeWidth = 60
  const pipeGapHeight = 150
  const pipeSpeed = 2
  const floorHeight = 40
  const pipeSpacing = 400

  const bird = useRef({ x: 80, y: canvasHeight / 2, velocity: 0 })
  const pipes = useRef<Pipe[]>([])
  const [canvasWidth, setCanvasWidth] = useState(800)

  const user = decodeJWT()?.user;

  useEffect(() => {
    const updateCanvasWidth = () => {
      const maxWidth = window.innerWidth - 40
      setCanvasWidth(Math.min(maxWidth, 1000))
    }
    updateCanvasWidth()
    window.addEventListener("resize", updateCanvasWidth)
    return () => window.removeEventListener("resize", updateCanvasWidth)
  }, [])

  const endGame = () => {
    setIsGameOver(true)
    setLastScore(currentScore)
    setIsGameRunning(false)
    const postScore = async () => {
      try {
        const res = await axiosClient.post("http://localhost:5000/api/score", {
          score: currentScore,
          userId: user.username,
          gamename: "flappybird",
        })
        console.log("Score saved:", res.data)
      } catch (err: any) {
        console.error("Failed to save score:", err.response?.data || err.message || err)
      }
    }
    postScore()
  }


  useEffect(() => {
    if (!isGameRunning) return
    const context = canvasRef.current!.getContext("2d")!
    let animationId: number

    const spawnPipe = () => {
      const gapYPosition = Math.random() * (canvasHeight - pipeGapHeight - floorHeight - 40) + 20
      pipes.current.push({ xPosition: canvasWidth, gapYPosition, passed: false })
    }

    const gameLoop = () => {
      if (!isGameRunning) return
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      context.fillStyle = "#87CEEB"
      context.fillRect(0, 0, canvasWidth, canvasHeight)
      context.fillStyle = "#4CAF50"
      context.fillRect(0, canvasHeight - floorHeight, canvasWidth, floorHeight)

      if (!isGameOver) {
        bird.current.velocity += gravityForce
        bird.current.y += bird.current.velocity
        context.fillStyle = "yellow"
        context.beginPath()
        context.arc(bird.current.x, bird.current.y, birdRadius, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = "green"
        pipes.current.forEach((pipe) => {
          pipe.xPosition -= pipeSpeed
          context.fillRect(pipe.xPosition, 0, pipeWidth, pipe.gapYPosition)
          context.fillRect(pipe.xPosition, pipe.gapYPosition + pipeGapHeight, pipeWidth, canvasHeight - pipe.gapYPosition - pipeGapHeight - floorHeight)
          if (
            bird.current.x + birdRadius > pipe.xPosition &&
            bird.current.x - birdRadius < pipe.xPosition + pipeWidth &&
            (bird.current.y - birdRadius < pipe.gapYPosition || bird.current.y + birdRadius > pipe.gapYPosition + pipeGapHeight)
          ) {
            endGame()
          }
          if (!pipe.passed && bird.current.x - birdRadius > pipe.xPosition + pipeWidth) {
            setCurrentScore((prev) => prev + 1)
            pipe.passed = true
          }
        })

        if (pipes.current.length === 0 || canvasWidth - pipes.current[pipes.current.length - 1].xPosition >= pipeSpacing) {
          spawnPipe()
        }

        pipes.current = pipes.current.filter(pipe => pipe.xPosition + pipeWidth > 0)

        if (bird.current.y + birdRadius > canvasHeight - floorHeight || bird.current.y - birdRadius < 0) {
          endGame()
        }
      }

      context.fillStyle = "black"
      context.font = "24px Arial"
      context.textAlign = "center"
      context.fillText(`Score: ${currentScore}`, canvasWidth / 2, 40)

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()
    return () => cancelAnimationFrame(animationId)
  }, [isGameRunning, isGameOver, currentScore, canvasWidth, lastScore])

  const handleBirdJump = () => {
    if (!isGameRunning) {
      startGame()
      return
    }
    bird.current.velocity = jumpForce
  }

  const startGame = () => {
    bird.current = { x: 80, y: canvasHeight / 2, velocity: 0 }
    pipes.current = []
    setCurrentScore(0)
    setIsGameOver(false)
    setIsGameRunning(true)
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full px-4">
      <div className="relative w-full" style={{ maxWidth: canvasWidth }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleBirdJump}
          className="border border-gray-400 w-full"
        />
        {!isGameRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
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
    </div>
  )
}
