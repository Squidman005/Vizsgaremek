import { createFileRoute } from '@tanstack/react-router'
import { Layout } from "@/components/layout"
import { BrickBreakerGame } from "@/components/brick-breaker-game"

export const Route = createFileRoute('/site/games/brick-breaker')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <Layout>
        <BrickBreakerGame />
      </Layout>
    )
}
