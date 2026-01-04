import { Layout } from '@/components/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/site/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Layout>
        <div>Ide majd leírjuk a nevünket, emailünket, mit csináltunk az oldalon, stb</div>  
      </Layout>
    </>
  )
}
