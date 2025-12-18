import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { decodeJWT } from "@/lib/decode-JWT";

export const Route = createFileRoute("/site/myuser")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = decodeJWT();

  if (loading) return <p>Loading...</p>; // wait until fetch completes
  if (!user) return <p>Not logged in</p>; // fallback

  return (
    <>
      <p>Logged in as: {user.username}</p> {/* display username */}
      <Button>Kijelentkezés</Button>
    </>
  );
}
