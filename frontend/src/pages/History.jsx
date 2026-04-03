import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch("/api/student/quizzes/history");
        setAttempts(data || []);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance History</h1>
          <p className="text-slate-500 mt-2">Track your growth and assessment records.</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center">
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Total Attempts</p>
              <h2 className="text-5xl font-black mt-2">{attempts.length}</h2>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Latest Score</p>
              <h2 className="text-3xl font-black text-slate-800 mt-2">
                {attempts.length > 0 ? `${attempts[0].score}%` : "N/A"}
              </h2>
              <p className="text-[10px] text-emerald-500 font-bold mt-2 uppercase">Verified Result</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assessment</th>
                    <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score Details</th>
                    <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-20 text-center animate-pulse text-slate-400 font-bold italic">
                        Retrieving secure records...
                      </td>
                    </tr>
                  ) : attempts.length > 0 ? (
                    attempts.map((attempt) => {
                      // 💡 Logic: Calculate correct answers from percentage for display
                      // Backend saves score as (correct/total)*100
                      const correctAnswers = Math.round((attempt.score / 100) * attempt.totalQuestions);

                      return (
                        <tr key={attempt.id} className="hover:bg-indigo-50/30 transition-all group">
                          <td className="p-6">
                            <p className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                              {attempt.quizTitle || "Unit Test"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ref ID: #{attempt.id}</p>
                          </td>
                          <td className="p-6 text-sm text-slate-500 font-semibold">
                            {new Date(attempt.createdAt).toLocaleDateString('en-IN', { 
                              day: '2-digit', month: 'short', year: 'numeric' 
                            })}
                          </td>
                          <td className="p-6 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`text-xl font-black ${attempt.score >= 40 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {attempt.score}%
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                ({correctAnswers} / {attempt.totalQuestions} Correct)
                              </span>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <button 
                              onClick={() => navigate("/result", { state: { score: attempt.score, quizId: attempt.quizId } })}
                              className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-100"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-24 text-center opacity-40">
                         <p className="text-4xl mb-4">📂</p>
                         <p className="font-black text-slate-800 uppercase tracking-widest">No Records Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default History;