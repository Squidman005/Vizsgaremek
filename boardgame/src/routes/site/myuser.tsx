import { createFileRoute } from "@tanstack/react-router";
import { decodeJWT } from "@/lib/decode-JWT";
import { Layout } from "@/components/layout"

export const Route = createFileRoute("/site/myuser")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = decodeJWT();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <>
      <Layout>
        <p>Logged in as: {user.username}</p> {/* display username */}
      </Layout>
    </>
  )
}
