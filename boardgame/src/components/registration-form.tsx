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
import { FieldDescription } from "./ui/field"

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
  return axiosClientWithoutAuth.post<RegistrationResponse>(
    "http://localhost:5000/api/users/",
    data
  )
}

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { mutate: registration, isPending } = useMutation({
    mutationFn: ({ data }: { data: RegistrationSchemaType }) =>
      postRegistration({ data }),
    onSuccess() {
      navigate({ to: "/login" })
    },
    onError(error: any) {
      console.log("Registration failed:", error.response?.data || error.message)
    },
  })

  const form = useForm<RegistrationSchemaType>({
    mode: "onChange",
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: RegistrationSchemaType) {
    registration({ data: values })
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center min-h-screen bg-white-900",
        className
      )}
      {...props}
    >
      <Card className="bg-gray-800 text-white shadow-lg w-full max-w-md">
        <CardHeader>
          <CardTitle>Regisztráció</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Név</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ujfelhasznalo1"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="pelda@email.hu"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Jelszó</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Regisztráció
              </Button>
              <FieldDescription className="text-center text-gray-300">
                Már van felhasználód?<br />
                <a
                  onClick={() => navigate({ to: "/login" })}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Jelentkezz be
                </a>
              </FieldDescription>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
