import { createFileRoute } from '@tanstack/react-router'
import { Layout } from "@/components/layout"
import { AimLabGame } from "@/components/aimlab-game"

export const Route = createFileRoute('/site/games/aimlab-game')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <AimLabGame />
    </Layout>
  )
}
