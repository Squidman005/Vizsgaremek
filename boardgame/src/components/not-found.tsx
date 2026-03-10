import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist.
          </p>

          <Button onClick={() => navigate({ to: "/site" })}>
            Go back home
          </Button>
        </div>
      </div>
    </Layout>
  )
}
