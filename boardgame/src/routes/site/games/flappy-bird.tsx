import { createFileRoute } from '@tanstack/react-router'
import { Layout } from "@/components/layout"
import { FlappyBirdGame } from "@/components/flappy-bird-game"
import { ScoreList } from "@/components/ScoreList"

export const Route = createFileRoute('/site/games/flappy-bird')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <FlappyBirdGame />
    </Layout>
  )
}
