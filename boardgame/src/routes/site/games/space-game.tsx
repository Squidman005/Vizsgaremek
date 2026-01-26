import { createFileRoute } from '@tanstack/react-router'
import { Layout } from "@/components/layout"
import { SpaceGame } from '@/components/space-game'

export const Route = createFileRoute('/site/games/space-game')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
      <Layout>
        <SpaceGame />
      </Layout>
    )
}
