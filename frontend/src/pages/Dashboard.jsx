import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const role = localStorage.getItem("role"); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = role === "FACULTY" ? "/api/faculty/quizzes" : "/api/student/quizzes";
        const quizData = await apiFetch(endpoint);
        setQuizzes(quizData || []);

        if (role === "STUDENT") {
          try {
            const attemptData = await apiFetch("/api/student/quizzes/history"); 
            setAttempts(attemptData || []);
          } catch (e) {
             console.error("Attempt fetch failed:", e);
          }
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, navigate]); 

  // Helper to check if quiz is expired
  const isQuizExpired = (endTime) => {
    if (!endTime) return false;
    return new Date(endTime) < new Date();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-bold text-slate-500 italic uppercase tracking-widest text-xs">Syncing Workspace...</p>
        </div>
    </div>
  );

  // --- FACULTY VIEW ---
  if (role === "FACULTY") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-10">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Panel</h1>
                <p className="text-slate-500 font-medium">Manage assessments and track student performance.</p>
              </div>
              <button 
                onClick={() => navigate("/faculty/create-quiz")} 
                className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95"
              >
                + Create New Quiz
              </button>
           </div>
           
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                 <tr>
                   <th className="p-8 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Assessment Title</th>
                   <th className="p-8 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Schedule</th>
                   <th className="p-8 text-[10px] font-bold uppercase text-slate-400 tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {quizzes.length > 0 ? quizzes.map(q => (
                   <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="p-8">
                        <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{q.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ID: #{q.id}</p>
                     </td>
                     <td className="p-8">
                        <p className="text-xs font-bold text-slate-600">{new Date(q.endTime).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Deadline</p>
                     </td>
                     <td className="p-8 text-right">
                        <button 
                          onClick={() => navigate(`/analytics/${q.id}`)} 
                          className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
                        >
                          View Analytics
                        </button>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan="3" className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs opacity-40">No assessments found.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [attempts.length, Math.max(0, quizzes.length - attempts.length)],
      backgroundColor: ['#10b981', '#6366f1'],
      hoverOffset: 10,
      borderWidth: 0,
    }]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-10">
        <header className="mb-10">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Dashboard</h1>
           <p className="text-slate-500 mt-2 font-medium">Hello Aditya, here is your progress report.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Visual Progress */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center">
              <h3 className="font-black text-slate-400 mb-8 uppercase text-[10px] tracking-widest">Assessment Flow</h3>
              <div className="w-52 h-52 relative">
                  <Pie data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-800">{attempts.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Passed</span>
                  </div>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                  <div className="text-center p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Completed</p>
                     <p className="text-2xl font-black text-emerald-700">{attempts.length}</p>
                  </div>
                  <div className="text-center p-5 bg-indigo-50 rounded-3xl border border-indigo-100">
                     <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">Available</p>
                     <p className="text-2xl font-black text-indigo-700">{Math.max(0, quizzes.length - attempts.length)}</p>
                  </div>
              </div>
           </div>

           {/* Quiz Selection List */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
              {quizzes.length > 0 ? quizzes.map(quiz => {
                const isDone = attempts.some(a => a.quizId === quiz.id);
                const isExpired = isQuizExpired(quiz.endTime);
                
                return (
                  <div key={quiz.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group ${isDone ? 'opacity-80 border-slate-100' : 'border-slate-200 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1'}`}>
                    
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex flex-col">
                          {isDone ? (
                            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-3">Completed ✓</span>
                          ) : isExpired ? (
                            <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-3">Expired ✕</span>
                          ) : (
                            <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-3">Live Now</span>
                          )}
                          <h3 className="font-black text-xl text-slate-800">{quiz.title}</h3>
                       </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{quiz.description}</p>
                    
                    <div className="flex items-center gap-2 mb-6">
                       <span className="text-slate-300">⏱️</span>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{quiz.duration} Minutes</span>
                    </div>

                    {isDone ? (
                      <button disabled className="bg-slate-50 text-slate-300 border border-slate-100 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest w-full cursor-not-allowed">
                        Already Attempted
                      </button>
                    ) : isExpired ? (
                      <button disabled className="bg-red-50 text-red-300 border border-red-500/10 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest w-full cursor-not-allowed">
                        Window Closed
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/quiz/${quiz.id}`)} 
                        className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest w-full hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                      >
                        Launch Assessment →
                      </button>
                    )}
                  </div>
                )
              }) : (
                <div className="col-span-2 bg-slate-50 p-20 rounded-[3rem] border-4 border-dashed border-slate-200 text-center">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No assignments currently active.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;