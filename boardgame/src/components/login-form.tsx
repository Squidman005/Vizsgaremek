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
import { axiosClient } from "@/lib/axios-client"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { FieldDescription } from "./ui/field"

const loginSchema = z.object({
  userID: z.string().min(5).nonempty(),
  password: z.string().min(5).nonempty(),
})

type LoginSchemaType = z.infer<typeof loginSchema>

type LoginResponse = {
  status: string,
  data: {
    token: string
  }
}

const postLogin = ({ data }: { data: LoginSchemaType }) => {
  return axiosClient.post<LoginResponse>("http://localhost:5000/api/auth/login", data)
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ data }: { data: LoginSchemaType }) => postLogin({ data }),
    onSuccess(data, variables, onMutateResult, context) {
      console.log("Login successful! Token:", data);
      navigate({
        to: "/site"
      })
    },
    onError(error: any) {
      console.log("Login failed:", error.response?.data || error.message);
    }
  })
  const form = useForm<LoginSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userID: "",
      password: ""
    },
  })

  function onSubmit(values: LoginSchemaType) {
    login({ data: values })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Bejelentkezés</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Név / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
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
              <Button type="submit">Bejelentkezés</Button>
                <FieldDescription className="text-center">
                    Ha még nincs felhasználód:<br/>
                    <a onClick={() => navigate({
                      to: "/registration"
                    })}>Regisztrálj</a>
                </FieldDescription>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
