import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios-client";
import { useState } from "react";

const passwordResetSchema = z.object({
  email: z.string().email("Érvényes email címet adj meg").nonempty(),
});

type PasswordResetType = z.infer<typeof passwordResetSchema>;

const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const resetPassword = (email: string, password: string) => {
  return axiosClient.put("/api/users/password-reset", { email, password });
};

export function PasswordResetCard() {
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetType>({
    mode: "onChange",
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: "" },
  });

  const { mutate: sendReset, isPending } = useMutation({
    mutationFn: (data: PasswordResetType) => {
      const newPassword = generateRandomPassword();
      return resetPassword(data.email, newPassword);
    },
    onSuccess: () => {
      setSuccess(true);
      form.reset();
    },
    onError(error: any) {
      console.log(error.response?.data || error.message);
      alert("Sikertelen jelszó visszaállítás. Ellenőrizd az email címet és próbáld újra.");
    },
  });

  const onSubmit = (values: PasswordResetType) => {
    sendReset(values);
  };

  return (
    <div className="flex justify-center pt-16">
      <Card className="w-full max-w-md text-center bg-gray-800 text-white shadow-lg rounded-xl p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold mb-4">Jelszó visszaállítása</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {success ? (
            <p className="text-green-400">
              Ha létezik ilyen email cím a rendszerünkben, egy új jelszót küldtünk!
            </p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email cím</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Add meg az email címed"
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
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Jelszó visszaállítása
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
