import { createFileRoute } from "@tanstack/react-router";
import { decodeJWT } from "@/lib/decode-JWT";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";

export const Route = createFileRoute("/site/myuser")({
  component: RouteComponent,
});

interface Score {
  gamename: string;
  score: number;
}

const passwordSchema = z.object({
  password: z.string().min(5),
});
type PasswordSchemaType = z.infer<typeof passwordSchema>;

const putPassword = (password: string) => {
  console.log("Sending password:", password);
  return axiosClient.put("/api/users/password", { password: password });
};


export function RouteComponent() {
  const { user, loading } = decodeJWT();
  const [scores, setScores] = useState<Score[]>([]);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const form = useForm<PasswordSchemaType>({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (data: PasswordSchemaType) => putPassword(data.password),
    onSuccess: () => {
      form.reset();
      setIsEditingPassword(false);
      window.location.reload();
    },
    onError(error: any) {
      console.log(error.response?.data?.message || error.message);
    },
  });

  function onSubmit(values: PasswordSchemaType) {
    console.log("Password to change to:", values.password);
    changePassword(values);
  }

  useEffect(() => {
    if (user) {
      axiosClient
        .get(`/api/score/player/${user.username}`, { withCredentials: true })
        .then((res) => setScores(res.data))
        .catch(() => setScores([]));
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <Layout>
      <div className="flex justify-center gap-8 pt-16 flex-wrap">
        <Card className="w-full max-w-md text-center bg-gray-800 text-white shadow-lg rounded-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-blue-400 text-xl font-bold">{user.username}</p>
              </div>
              <Pencil className="cursor-pointer opacity-60" size={18} />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Password</p>
                <p className="font-bold tracking-widest">************</p>
              </div>

              {isEditingPassword ? (
                <X
                  className="cursor-pointer text-red-400"
                  size={18}
                  onClick={() => {
                    setIsEditingPassword(false);
                    form.reset();
                  }}
                />
              ) : (
                <Pencil
                  className="cursor-pointer"
                  size={18}
                  onClick={() => setIsEditingPassword(true)}
                />
              )}
            </div>

            {isEditingPassword && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 pt-4 border-t border-gray-600"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="bg-gray-700 text-white border-gray-600"
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
                    Change Password
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card className="w-full max-w-md text-center shadow-md rounded-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">Your Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scores.length === 0 ? (
                <p>No scores yet.</p>
              ) : (
                scores.map((s) => (
                  <li
                    key={s.gamename}
                    className="flex justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded"
                  >
                    <span className="font-medium">{s.gamename}</span>
                    <span className="font-bold text-green-500">{s.score}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
