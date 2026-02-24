import { createFileRoute } from '@tanstack/react-router'
import { decodeJWT } from "@/lib/decode-JWT"
import { GameCard } from "@/components/gamecard"
import { Layout } from "@/components/layout"

export const Route = createFileRoute('/site/')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = decodeJWT()
  console.log(user)

  return (
    <>
      <Layout>

        <div className="px-4 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 mb-6">
          <GameCard
            name="Flappy Bird"
            imageSrc="/images/flappybird.png"
            navigateTo="/site/games/flappy-bird"
          />

          <GameCard
            name="Space Game"
            imageSrc="/images/spacegame.png"
            navigateTo="/site/games/space-game"
          />

          <GameCard
            name="Aim Lab"
            imageSrc="/images/aimlab.png"
            navigateTo="/site/games/aimlab-game"
          />

          <GameCard
            name="Brick Breaker"
            imageSrc="/images/brickbreaker.png"
            navigateTo="/site/games/brick-breaker"
          />

          <GameCard
            name="Placeholder Game"
            imageSrc="/images/placeholder.png"
            navigateTo="#"
          />
        </div>
        
      </Layout>
    </>
  )
}
