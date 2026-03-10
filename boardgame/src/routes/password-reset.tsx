import { createFileRoute } from "@tanstack/react-router";
import { PasswordResetCard } from "@/components/password-reset";

export const Route = createFileRoute("/password-reset")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PasswordResetCard />;
}
