import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/site/')({
  component: RouteComponent,
})

import { Button } from "@/components/ui/button"

import { decodeJWT } from "@/lib/decode-JWT"

function RouteComponent() {
  const navigate = useNavigate();
  const user = decodeJWT();
  console.log(user);
  return (<>
    <Button>Új szoba</Button>
    <Button onClick={() => navigate({
      to: "/site/myuser"
    })}>Saját felhasználó megtekintése</Button>
  </>)
}
