import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Result() {

  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-3xl font-bold mb-4">
            Quiz Completed 🎉
          </h2>
          <p className="text-xl mb-6">
            Your Score: {score}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}

export default Result;