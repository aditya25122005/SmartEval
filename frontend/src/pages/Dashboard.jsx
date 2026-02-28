import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";

function Dashboard() {

  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await apiFetch("/api/student/quizzes");
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-6">Available Quizzes</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {quiz.title}
              </h3>
              <p className="text-gray-600 mb-2">
                {quiz.description}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {quiz.duration} minutes
              </p>

              <button
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;