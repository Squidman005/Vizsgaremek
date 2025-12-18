import { createFileRoute } from '@tanstack/react-router'
import { RegistrationForm } from '@/components/registration-form'

export const Route = createFileRoute('/registration')({
  component: RouteComponent,
})

function RouteComponent() {
    return (<>
        <RegistrationForm />
    </>)
}
