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
            imageSrc="/images/placeholder.png"
            navigateTo="/site/games/flappy-bird"
          />

          <GameCard
            name="Flappy Bird"
            imageSrc="/images/placeholder.png"
            navigateTo="/site/games/flappy-bird"
          />
        </div>
        
      </Layout>
    </>
  )
}
