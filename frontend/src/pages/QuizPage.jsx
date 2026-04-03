import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. STATES
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [incidents, setIncidents] = useState(0); // 🚨 Tracks tab switches
  const timerRef = useRef(null);

  // 2. FUNCTIONS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      // Correcting formatted answers to match Backend expectation
      const formattedAnswers = Object.entries(answers)
        .filter(([_, optId]) => optId !== null)
        .map(([qId, optId]) => ({
          questionId: Number(qId),
          selectedOptionId: optId
        }));

      // 🚨 PAYLOAD FIX: Sending cheatCount with final submission
      const payload = {
        quizId: Number(id),
        answers: formattedAnswers,
        cheatCount: incidents // This will now update the DB
      };

      const score = await apiFetch("/api/student/quizzes/submit", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Score ab backend se percentage mein aayega
      navigate("/result", { state: { score, quizId: Number(id) } });
    } catch (err) {
      toast.error(err.message || "Error submitting quiz.");
    }
  };

  // 3. EFFECTS
  // Fetch Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await apiFetch(`/api/student/quizzes/${id}`);
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
        if (quizData.duration) setTimeLeft(quizData.duration * 60);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Could not load quiz.");
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      toast.error("Time is up! Auto-submitting...");
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  // 🚨 FIXED: Tab Switching & Local Incident Counting
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIncidents(prev => prev + 1); // Locally count tab switches
        toast.error("WARNING: Tab switch detected! This incident is being recorded.", {
          duration: 5000,
          icon: '⚠️',
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (!quiz || questions.length === 0) {
    return <div className="p-10 text-center text-xl font-bold animate-pulse">Initializing Secure Assessment Environment...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Header: Pro NTA Style */}
      <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white px-3 py-1 rounded font-black text-sm tracking-tighter italic">SmartEval</div>
          <div>
            <h1 className="text-lg font-black text-slate-800">{quiz.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-Progress Assessment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="text-center px-6 border-x">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Time Remaining</p>
            <p className={`text-2xl font-mono font-black ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-sm font-bold text-slate-700">Aditya Maheshwari</p>
                <p className="text-[10px] text-slate-400 font-bold">B.Tech - 3rd Year</p>
             </div>
             <div className="w-10 h-10 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">AM</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* LEFT: Question Canvas */}
        <main className="flex-[3] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-y-auto p-10 relative">
          <div className="flex justify-between items-center mb-10">
             <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-black tracking-widest">
               QUESTION {currentIndex + 1} OF {questions.length}
             </span>
             <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Link Active</span>
             </div>
          </div>

          <div className="text-2xl text-slate-800 font-bold mb-10 leading-snug">
             {currentQuestion.title}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((opt, idx) => (
              <label key={opt.id} className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                answers[currentQuestion.id] === opt.id 
                ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
              }`}>
                <input 
                  type="radio" 
                  name="option" 
                  className="w-5 h-5 accent-indigo-600" 
                  checked={answers[currentQuestion.id] === opt.id}
                  onChange={() => handleOptionSelect(currentQuestion.id, opt.id)}
                />
                <span className="ml-5 text-slate-700 font-bold text-lg">
                  <span className="text-indigo-300 mr-2">{String.fromCharCode(65 + idx)})</span> {opt.optionText}
                </span>
              </label>
            ))}
          </div>
        </main>

        {/* RIGHT: Navigation Palette */}
        <aside className="w-80 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Question Palette</h3>
          <div className="grid grid-cols-4 gap-3 overflow-y-auto pb-4">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all transform active:scale-90 ${
                  currentIndex === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                  answers[questions[i].id] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-6 border-t space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Answered</span>
                </div>
                <span className="text-sm font-black">{Object.keys(answers).length}</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Pending</span>
                </div>
                <span className="text-sm font-black">{questions.length - Object.keys(answers).length}</span>
             </div>
          </div>
        </aside>
      </div>

      {/* Footer: Action Bar */}
      <footer className="bg-white border-t p-6 flex justify-between items-center px-12">
        <div className="flex gap-4">
          <button 
            className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl text-sm font-bold hover:bg-slate-200 transition active:scale-95" 
            onClick={() => setAnswers({...answers, [currentQuestion.id]: null})}
          >
            Clear Response
          </button>
          <button 
            disabled={currentIndex === questions.length - 1}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition disabled:opacity-30 active:scale-95"
            onClick={() => setCurrentIndex(prev => prev + 1)}
          >
            Next Question →
          </button>
        </div>
        
        <button 
          className="bg-indigo-600 text-white px-16 py-4 rounded-2xl shadow-xl shadow-indigo-100 font-black tracking-widest hover:bg-slate-900 transition-all transform hover:-translate-y-1 active:translate-y-0" 
          onClick={() => { if(window.confirm("Are you sure you want to final submit?")) handleSubmit(); }}
        >
          FINAL SUBMIT
        </button>
      </footer>
    </div>
  );
}

export default QuizPage;