import { useEffect, useRef, useState, useCallback } from "react"
import { decodeJWT } from "@/lib/decode-JWT"
import { axiosClient } from "@/lib/axios-client"
import { ScoreList } from "./ScoreList"
import { CanvasGlow } from "./CanvasGlow"

type BrickType = "normal" | "strong" | "small" | "speed"
type Brick = { x: number; y: number; width: number; height: number; visible: boolean; hitsRemaining: number; type: BrickType }

export function BrickBreakerGame() {
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [lastScore, setLastScore] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const user = decodeJWT()?.user

  const desktopWidth = 800
  const desktopHeight = 600
  const mobileWidth = window.innerWidth - 20
  const mobileHeight = 500
  const canvasWidth = isMobile ? mobileWidth : desktopWidth
  const canvasHeight = isMobile ? mobileHeight : desktopHeight
  const paddleWidth = isMobile ? 100 : 120
  const paddleHeight = 15
  const paddleSpeed = 7
  const ballRadius = 8
  const baseBallSpeed = 5
  const brickWidth = 75
  const brickHeight = 20
  const brickPadding = 10
  const brickOffsetTop = 60
  const brickOffsetLeft = 35
  const brickRows = 4

  const paddle = useRef({ x: canvasWidth / 2 - paddleWidth / 2 })
  const ball = useRef({ x: canvasWidth / 2, y: canvasHeight - 60, dx: baseBallSpeed, dy: -baseBallSpeed, speedMultiplier: 1 })
  const bricks = useRef<Brick[]>([])
  const rightPressed = useRef(false)
  const leftPressed = useRef(false)

  const randomBrickType = (): BrickType => {
    const roll = Math.random()
    if (roll < 0.3) return "strong"
    if (roll < 0.6) return "small"
    if (roll < 0.7) return "speed"
    return "normal"
  }

  const spawnBricks = () => {
    bricks.current = []
    const columns = Math.floor((canvasWidth - brickOffsetLeft * 2) / (brickWidth + brickPadding))
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < columns; c++) {
        const type = randomBrickType()
        let width = brickWidth
        if (type === "small") width = brickWidth / 2
        const x = c * (brickWidth + brickPadding) + brickOffsetLeft + (brickWidth - width) / 2
        const y = r * (brickHeight + brickPadding) + brickOffsetTop
        const hitsRemaining = type === "strong" ? 2 : 1
        bricks.current.push({ x, y, width, height: brickHeight, visible: true, hitsRemaining, type })
      }
    }
  }

  const startGame = () => {
    paddle.current.x = canvasWidth / 2 - paddleWidth / 2
    ball.current = { x: canvasWidth / 2, y: canvasHeight - 60, dx: baseBallSpeed, dy: -baseBallSpeed, speedMultiplier: 1 }
    setCurrentScore(0)
    setIsGameOver(false)
    setIsGameRunning(true)
    spawnBricks()
  }

  const endGame = async () => {
    setIsGameOver(true)
    setIsGameRunning(false)
    try {
      await axiosClient.post("http://localhost:5000/api/score", { score: currentScore, userId: user.username, gamename: "brickbreaker" })
      setLastScore(currentScore)
    } catch {}
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "ArrowRight") rightPressed.current = true; if (e.key === "ArrowLeft") leftPressed.current = true }
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === "ArrowRight") rightPressed.current = false; if (e.key === "ArrowLeft") leftPressed.current = false }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("keyup", handleKeyUp) }
  }, [])

  const renderCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!isGameRunning) return

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    gradient.addColorStop(0, "#0a0a0f")
    gradient.addColorStop(1, "#111827")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    if (rightPressed.current) paddle.current.x += paddleSpeed
    if (leftPressed.current) paddle.current.x -= paddleSpeed
    paddle.current.x = Math.max(0, Math.min(canvasWidth - paddleWidth, paddle.current.x))

    ball.current.x += ball.current.dx * ball.current.speedMultiplier
    ball.current.y += ball.current.dy * ball.current.speedMultiplier

    if (ball.current.x + ballRadius > canvasWidth || ball.current.x - ballRadius < 0) ball.current.dx *= -1
    if (ball.current.y - ballRadius < 0) ball.current.dy *= -1

    if (ball.current.y + ballRadius > canvasHeight - paddleHeight - 10 && ball.current.x > paddle.current.x && ball.current.x < paddle.current.x + paddleWidth) {
      const hitPoint = (ball.current.x - (paddle.current.x + paddleWidth / 2)) / (paddleWidth / 2)
      const angle = hitPoint * (Math.PI / 3)
      ball.current.dx = baseBallSpeed * Math.sin(angle)
      ball.current.dy = -baseBallSpeed * Math.cos(angle)
    }

    if (ball.current.y + ballRadius > canvasHeight) endGame()

    bricks.current.forEach((brick) => {
      if (!brick.visible) return
      if (ball.current.x + ballRadius > brick.x && ball.current.x - ballRadius < brick.x + brick.width &&
          ball.current.y + ballRadius > brick.y && ball.current.y - ballRadius < brick.y + brick.height) {
        ball.current.dy *= -1
        brick.hitsRemaining--
        if (brick.hitsRemaining <= 0) {
          brick.visible = false
          setCurrentScore(prev => prev + 1)
          if (brick.type === "speed") { ball.current.speedMultiplier = 1.8; setTimeout(() => { ball.current.speedMultiplier = 1 }, 3000) }
        }
      }
    })

    if (bricks.current.every(b => !b.visible)) spawnBricks()

    ctx.shadowBlur = 15
    ctx.shadowColor = "#00f5ff"
    ctx.fillStyle = "#00f5ff"
    ctx.fillRect(paddle.current.x, canvasHeight - paddleHeight - 10, paddleWidth, paddleHeight)
    ctx.shadowBlur = 0

    ctx.beginPath()
    ctx.arc(ball.current.x, ball.current.y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#ff2e63"
    ctx.shadowBlur = 20
    ctx.shadowColor = "#ff2e63"
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.closePath()

    bricks.current.forEach((brick) => {
      if (!brick.visible) return
      let color = "#22d3ee"
      if (brick.type === "strong") color = "#a78bfa"
      if (brick.type === "small") color = "#facc15"
      if (brick.type === "speed") color = "#4ade80"
      ctx.shadowBlur = 12
      ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
      ctx.shadowBlur = 0
    })

    ctx.fillStyle = "#ffffff"
    ctx.font = "22px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`Score: ${currentScore}`, canvasWidth / 2, 30)
  }, [isGameRunning, currentScore, canvasWidth, canvasHeight])

  return (
    <div className="flex flex-col items-center gap-8 w-full px-4">
      <div className="relative" style={{ width: canvasWidth }}>
        <CanvasGlow width={canvasWidth} height={canvasHeight} render={renderCanvas} />
        {!isGameRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            {isGameOver && <p className="text-3xl text-white font-bold mb-4">Game Over! Score: {currentScore}</p>}
            <button className="bg-blue-600 text-white px-6 py-3 rounded" onClick={startGame}>{isGameOver ? "Restart Game" : "Start Game"}</button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-2 justify-center">
        <button
          className="w-12 h-12 rounded-full bg-gray-800 text-white text-2xl flex items-center justify-center"
          onMouseDown={() => leftPressed.current = true}
          onMouseUp={() => leftPressed.current = false}
          onTouchStart={() => leftPressed.current = true}
          onTouchEnd={() => leftPressed.current = false}
        >
          ◀
        </button>
        <button
          className="w-12 h-12 rounded-full bg-gray-800 text-white text-2xl flex items-center justify-center"
          onMouseDown={() => rightPressed.current = true}
          onMouseUp={() => rightPressed.current = false}
          onTouchStart={() => rightPressed.current = true}
          onTouchEnd={() => rightPressed.current = false}
        >
          ▶
        </button>
      </div>

      <ScoreList
        gamename="brickbreaker"
        title="Brick Breaker"
        controls="Arrow keys or buttons"
        description={`Break the bricks with the ball, don't let it fall\n\tBrick types:\n\t\tNormal: Breaks in one hit\n\t\tStrong: Needs two hits\n\t\tSmall: Half-width brick\n\t\tSpeed: Increases ball speed temporarily`}
        refreshKey={lastScore}
      />
    </div>
  )
}
