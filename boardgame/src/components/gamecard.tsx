import { useRef } from "react"
import { useNavigate } from "@tanstack/react-router"

type GameCardProps = {
  name: string
  imageSrc: string
  navigateTo: string
}

export function GameCard({ name, imageSrc, navigateTo }: GameCardProps) {
  const navigate = useNavigate()
  const imgRef = useRef<HTMLImageElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const img = imgRef.current
    if (!img) return

    const rect = img.getBoundingClientRect()
    const clone = img.cloneNode(true) as HTMLImageElement
    clone.style.position = "fixed"
    clone.style.left = `${rect.left}px`
    clone.style.top = `${rect.top}px`
    clone.style.width = `${rect.width}px`
    clone.style.height = `${rect.height}px`
    clone.style.transition = "all 0.5s ease-in-out"
    clone.style.zIndex = "0" // behind Layout
    clone.style.borderRadius = "12px"
    document.body.appendChild(clone)

    requestAnimationFrame(() => {
      clone.style.left = "0"
      clone.style.top = "0"
      clone.style.width = "100vw"
      clone.style.height = "100vh"
      clone.style.borderRadius = "0"
    })

    setTimeout(() => {
      document.body.removeChild(clone)
      navigate({ to: navigateTo })
    }, 500)
  }

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] rounded-xl overflow-hidden bg-background shadow-sm hover:shadow-lg transition-all"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          ref={imgRef}
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="px-4 py-3 text-center font-semibold leading-tight break-words text-[clamp(0.8rem,2.4vw,1.1rem)]">
        {name}
      </div>
    </div>
  )
}
