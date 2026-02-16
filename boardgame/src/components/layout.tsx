import { useNavigate } from "@tanstack/react-router"
import { LogoutButton } from "@/components/logout"
import { Button } from "./ui/button"

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="flex items-center justify-between h-14 px-4 bg-gray-800 text-white shadow-md">
        <nav className="flex items-center gap-4">
          <button onClick={() => navigate({ to: "/site" })} className="text-sm font-medium hover:underline">
            Home
          </button>
          <button onClick={() => navigate({ to: "/site/myuser" })} className="text-sm font-medium hover:underline">
            My User
          </button>
        </nav>

        <div className="flex items-center gap-2 transition hover:brightness-130">
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        {children}
      </main>

      <footer className="bg-gray-800 text-white border-t border-gray-700 text-sm px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>© 2026 — Kóté Máté Adrián, Magyar Martina, Zsidákovits Bálint</div>
        <Button
          onClick={() => navigate({ to: "/site/about" })}
        >
          About
        </Button>
      </footer>
    </div>
  )
}
