import { Link } from "@tanstack/react-router"

type GameCardProps = {
  name: string
  imageSrc: string
  navigateTo: string
}

export function GameCard({ name, imageSrc, navigateTo }: GameCardProps) {
  return (
    <Link to={navigateTo} className="group w-[160px] overflow-hidden rounded-md bg-background shadow-sm transition hover:shadow-md">

      <div className="aspect-[3/4] overflow-hidden">
        <img src={imageSrc} alt={name} className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>

      <div className="px-2 py-1 text-sm text-center truncate">{name}</div>
    </Link>
  )
}
