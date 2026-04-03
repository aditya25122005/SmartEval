import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Leaderboard from "./Leaderboard"; // Import the component

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract score and quizId from navigation state
  const score = location.state?.score;
  const quizId = location.state?.quizId;

  // If someone tries to access /result directly without taking a quiz
  if (score === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">No Result Found</h2>
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Main Score Card */}
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center border-t-8 border-green-500">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-gray-500 mb-6 uppercase tracking-widest font-semibold">
              Performance Summary
            </p>
            
            <div className="inline-block bg-green-50 px-8 py-4 rounded-2xl border-2 border-green-200 mb-8">
              <span className="text-sm text-green-600 font-bold block uppercase">Your Final Score</span>
              <span className="text-5xl font-black text-green-700">{score}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all transform hover:scale-105"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/history")}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                View History
              </button>
            </div>
          </div>

          {/* Leaderboard Section - Automatically appears if we have a quizId */}
          {quizId && (
            <div className="mt-10">
              <Leaderboard quizId={quizId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Result;