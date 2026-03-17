import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: IndexPage })

function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-800 text-white rounded-3xl shadow-2xl p-10 sm:p-14 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-12 tracking-tight">
          Small Games
        </h1>
        <h2 className="text-2xl sm:text-2xl font-bold mb-12 tracking-tight">
          A site to play small minigames on.
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            className="px-8 py-6 text-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
            onClick={() => navigate({ to: '/login' })}
          >
            Login
          </Button>

          <Button
            variant="secondary"
            className="px-8 py-6 text-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
            onClick={() => navigate({ to: '/registration' })}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  )
}
