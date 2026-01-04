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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ data }: { data: LoginSchemaType }) => postLogin({ data }),
    onSuccess(data) {
      console.log("Login successful! Token:", data)
      navigate({ to: "/site" })
    },
    onError(error: any) {
      console.log("Login failed:", error.response?.data || error.message)
    },
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
    <div className={cn("flex flex-col gap-6 items-center justify-center min-h-screen bg-white-900", className)} {...props}>
      <Card className="bg-gray-800 text-white shadow-lg w-full max-w-md">
        <CardHeader>
          <CardTitle>Bejelentkezés</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Név / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="bg-gray-700 text-white border-gray-600 placeholder-gray-400" />
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
                      <Input placeholder="********" {...field} className="bg-gray-700 text-white border-gray-600 placeholder-gray-400" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Bejelentkezés
              </Button>
              <FieldDescription className="text-center text-gray-300">
                Ha még nincs felhasználód:<br />
                <a onClick={() => navigate({ to: "/registration" })} className="text-blue-400 hover:underline cursor-pointer">
                  Regisztrálj
                </a>
              </FieldDescription>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
