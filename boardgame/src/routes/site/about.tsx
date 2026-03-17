import { Layout } from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/site/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <div className="flex justify-center gap-8 pt-16 flex-wrap">
        
        <Card className="w-full max-w-md text-center bg-gray-800 text-white shadow-lg rounded-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">
              About This Project
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-300">
            <p>
              This project was created as the final project for our final exam.
            </p>
            <br/>
            <p>
              This website is a collection of simple games built using React and TypeScript. We use these games to demonstrate how the backend database of users and scores work.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md text-center shadow-lg rounded-xl p-8 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">
              Developers
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between bg-gray-700 p-3 rounded">
              <span className="font-medium">Frontend</span>
              <span className="text-blue-400">Kóté Máté Adrián</span>
            </div>

            <div className="flex justify-between bg-gray-700 p-3 rounded">
              <span className="font-medium">Backend / Application</span>
              <span className="text-blue-400">Magyar Martina</span>
            </div>

            <div className="flex justify-between bg-gray-700 p-3 rounded">
              <span className="font-medium">Testing / Documentation</span>
              <span className="text-blue-400">Zsidákovits Bálint</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md text-center shadow-lg rounded-xl p-8 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">
              Contact Emails
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="flex justify-between bg-gray-700 p-3 rounded">
              squidman009@gmail.com
            </p>
            <p className="flex justify-between bg-gray-700 p-3 rounded">
              martina.magyar07@gmail.com
            </p>
            <p className="flex justify-between bg-gray-700 p-3 rounded">
              zsbalint07@gmail.com
            </p>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
