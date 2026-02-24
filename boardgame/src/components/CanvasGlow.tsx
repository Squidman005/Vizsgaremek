import { useEffect, useRef } from "react"

type CanvasGlowProps = {
  width: number
  height: number
  render: (ctx: CanvasRenderingContext2D) => void
}

export function CanvasGlow({ width, height, render }: CanvasGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!
    let animationId: number

    const drawLoop = () => {
      ctx.clearRect(0, 0, width, height)
      render(ctx)
      animationId = requestAnimationFrame(drawLoop)
    }

    drawLoop()
    return () => cancelAnimationFrame(animationId)
  }, [render, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}
