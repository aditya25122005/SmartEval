import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

function Leaderboard({ idFromProps }) {
  // 🛡️ Fix 1: Agar URL se ID mil rahi hai toh useParams, warna Props se lo
  const { quizId: idFromParams } = useParams();
  const quizId = idFromProps || idFromParams; 

  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🛡️ Fix 2: "undefined" API call ko rokne ke liye check
    if (!quizId || quizId === "undefined") {
      console.warn("Leaderboard: Quiz ID is missing.");
      return;
    }

    const fetchBoard = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/student/quizzes/${quizId}/leaderboard`);
        setRankings(data || []);
      } catch (err) {
        console.error("Leaderboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [quizId]);

  if (!quizId || quizId === "undefined") return null;
  if (loading) return <div className="p-4 text-center text-sm text-slate-400 animate-pulse">Loading Rankings...</div>;

  return (
    <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <span className="text-3xl">🏆</span> Leaderboard
        </h2>
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Top Performers
        </span>
      </div>

      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
              <th className="pb-4 font-bold">Rank</th>
              <th className="pb-4 font-bold">Student</th>
              <th className="pb-4 font-bold text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rankings.length > 0 ? rankings.map((r, index) => (
              <tr key={r.id || index} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    index === 0 ? "bg-yellow-100 text-yellow-700" : 
                    index === 1 ? "bg-slate-100 text-slate-700" : 
                    index === 2 ? "bg-orange-100 text-orange-700" : "text-slate-400"
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-4">
                   <p className="font-bold text-slate-700">Student #{r.studentId}</p>
                </td>
                <td className="py-4 text-right">
                  <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                    {r.score}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="py-10 text-center text-slate-400 text-sm font-medium">
                  No attempts yet. Be the first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;