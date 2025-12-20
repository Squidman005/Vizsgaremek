
import { createFileRoute } from '@tanstack/react-router';
import { decodeJWT } from '@/lib/decode-JWT';
import { LogoutButton } from '@/lib/logout';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/site/')({
  loader: decodeJWT, // async loader
  component: SiteComponent,
  notFoundComponent: () => <p>Page not found!</p>,
});

function SiteComponent() {
  const { user, loading } = Route.useLoaderData();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <p>Welcome, {user.username}</p>
      <Button>Új szoba</Button>
      <Button>Saját felhasználó megtekintése</Button>
      <LogoutButton />
    </>
  );
}
