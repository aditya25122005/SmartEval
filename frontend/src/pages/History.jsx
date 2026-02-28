import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";

function History() {

  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch("/api/student/quizzes/history");
        setAttempts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-6">Quiz History</h2>

        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <p>Quiz ID: {attempt.quizId}</p>
            <p>Score: {attempt.score}</p>
            <p>Date: {attempt.submittedAt}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default History;