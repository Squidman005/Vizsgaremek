import { createFileRoute } from "@tanstack/react-router";
import { decodeJWT } from "@/lib/decode-JWT";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axios-client";
import { Button } from "@/components/ui/button"; // a Layout-ból

export const Route = createFileRoute("/site/myuser")({
  component: RouteComponent,
});

interface Score {
  gamename: string;
  score: number;
}

function RouteComponent() {
  const { user, loading } = decodeJWT();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (user) {
      axiosClient
        .get(`/api/score/player/${user.username}`)
        .then((res) => setScores(res.data))
        .catch(() => setScores([]));
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <Layout>
      <div className="flex justify-center gap-8 pt-16 flex-wrap">
        {/* User Info Card */}
        <Card className="w-full max-w-md text-center bg-gray-800 text-white shadow-lg rounded-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-2">You are logged in as:</p>
            <p className="text-blue-400 text-xl font-bold mb-4">{user.username}</p>

            {/* Buttons like LogoutButton */}
            <div className="flex justify-center gap-4 mt-4">
              <Button className="transition hover:brightness-130" onClick={() => { /* még nincs funkció */ }}>
                Change Username
              </Button>
              <Button className="transition hover:brightness-130" onClick={() => { /* még nincs funkció */ }}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scores Card */}
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
