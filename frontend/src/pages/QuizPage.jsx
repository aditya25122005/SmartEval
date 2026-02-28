import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";

function QuizPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await apiFetch(`/api/student/quizzes/${id}`);
        console.log(quizData);
        setQuiz(quizData);

        const questionData = [];
    
        setQuestions(quizData.questions);

      } catch (err) {
        console.error(err);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const handleSubmit = async () => {
    try {

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
          questionId: Number(questionId),
          selectedOptionId
        })
      );

      const score = await apiFetch("/api/student/quizzes/submit", {
        method: "POST",
        body: JSON.stringify({
          quizId: Number(id),
          answers: formattedAnswers
        })
      });

      navigate("/result", { state: { score } });

    } catch (err) {
      alert(err.message);
    }
  };

  if (!quiz || questions.length === 0) {
    return <p className="p-6">Loading...</p>;
  }

  const currentQuestion = questions[currentIndex];
  console.log(currentQuestion);
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto">

          <h2 className="text-2xl font-bold mb-4">
            {quiz.title}
          </h2>

          <p className="mb-4 font-semibold">
            Question {currentIndex + 1} / {questions.length}
          </p>

          <p className="mb-4">
            {currentQuestion.description}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => (
              <div
                key={opt.id}
                className={`p-3 border rounded cursor-pointer ${
                  answers[currentQuestion.id] === opt.id
                    ? "bg-blue-200"
                    : "bg-gray-50"
                }`}
                onClick={() =>
                  handleOptionSelect(currentQuestion.id, opt.id)
                }
              >
                {opt.optionText}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Prev
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizPage;