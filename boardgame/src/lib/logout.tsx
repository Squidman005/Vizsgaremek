import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { axiosClient } from "@/lib/axios-client"
import { Button } from "@/components/ui/button"

const logoutRequest = () => {
  return axiosClient.delete("http://localhost:5000/api/auth/logout", {
    withCredentials: true,
  })
}

export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess() {
      navigate({ to: "/login" })
    },
  })
}

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout()

  return (
    <Button onClick={() => logout()} disabled={isPending}>
      Kijelentkezés
    </Button>
  )
}
