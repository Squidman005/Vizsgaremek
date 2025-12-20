import { createFileRoute } from "@tanstack/react-router";
import { decodeJWT } from "@/lib/decode-JWT";
import { LogoutButton } from "@/lib/logout";

export const Route = createFileRoute("/site/myuser")({
  loader: decodeJWT,
  pendingComponent: () => <p>Loading...</p>,
  component: RouteComponent,
  notFoundComponent: () => <p>Page not found</p>,
});

function RouteComponent() {
  const { user, loading } = Route.useLoaderData();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <>
      <p>Logged in as: {user.username}</p>
      <LogoutButton />
    </>
  );
}
