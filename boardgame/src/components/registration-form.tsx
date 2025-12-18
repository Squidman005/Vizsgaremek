import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { axiosClientWithoutAuth } from "@/lib/axios-client"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

const registrationSchema = z.object({
  username: z.string().min(5).nonempty(),
  email: z.string().email(),
  password: z.string().min(5).nonempty(),
})

type RegistrationSchemaType = z.infer<typeof registrationSchema>

type RegistrationResponse = {
  status: string,
  data: {
    token: string
  }
}

const postRegistration = ({ data }: { data: RegistrationSchemaType }) => {
  return axiosClientWithoutAuth.post<RegistrationResponse>("http://localhost:5000/api/users/", data)
}

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { mutate: registration, isPending } = useMutation({
    mutationFn: ({ data }: { data: RegistrationSchemaType }) => postRegistration({ data }),
    onSuccess(data, variables, onMutateResult, context) {
      navigate({
        to: "/login"
      })
    },
  })
  const form = useForm<RegistrationSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      username: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: RegistrationSchemaType) {
    registration({ data: values })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Regisztáció</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Név</FormLabel>
                    <FormControl>
                      <Input placeholder="ujfelhasznalo1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="pelda@email.hu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jelszó</FormLabel>
                    <FormControl>
                      <Input placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Regisztráció</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
