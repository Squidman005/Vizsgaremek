import { useEffect, useState } from "react"
import { axiosClient } from "@/lib/axios-client"

type Score = {
  ID: number
  userId: string
  score: number
  gamename: string
}

type ScoreListProps = {
  gamename: string
  title: string
  controls: string
  description: string
  refreshKey?: number
}

export function ScoreList({ gamename, title, controls, description, refreshKey }: ScoreListProps) {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axiosClient
      .get(`http://localhost:5000/api/score/${gamename}`)
      .then(res => setScores(res.data))
      .finally(() => setLoading(false))
  }, [gamename, refreshKey])

  return (
    <div className="w-full flex justify-center mt-8">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : scores.length === 0 ? (
              <p className="text-gray-400">No scores yet</p>
            ) : (
              <ul className="space-y-2">
                {scores.map((score, index) => (
                  <li
                    key={score.ID}
                    className="flex justify-between border-b border-gray-700 pb-1"
                  >
                    <span className="font-medium">
                      {index + 1}. {score.userId}
                    </span>
                    <span>{score.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="mb-4">
              <h3 className="text-gray-300 font-semibold mb-1">Controls:</h3>
              <p className="text-gray-200">{controls}</p>
            </div>
            <div>
              <h3 className="text-gray-300 font-semibold mb-1">Description:</h3>
              <p style={{ whiteSpace: "pre-wrap" }} className="text-gray-200">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
