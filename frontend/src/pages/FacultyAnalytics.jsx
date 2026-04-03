import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FacultyAnalytics() {
  const { quizId } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Backend endpoint: /api/faculty/quizzes/{quizId}/stats
        const data = await apiFetch(`/api/faculty/quizzes/${quizId}/stats`);
        setStats(data);
      } catch (err) {
        console.error("Analytics Fetch Error:", err);
      }
    };
    fetchStats();
  }, [quizId]);

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  // Chart Data: Score Distribution
  const chartData = {
    labels: stats.students.map(s => s.name),
    datasets: [
      {
        label: 'Student Scores (%)',
        data: stats.students.map(s => s.score),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quiz Analytics</h1>
          <p className="text-slate-500 mt-2 text-lg">Detailed performance report for: <span className="text-indigo-600 font-bold">{stats.quizTitle}</span></p>
        </header>
        
        {/* Top Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg. Score</p>
            <h2 className="text-4xl font-black text-indigo-600 mt-2">{stats.averageScore}%</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Attempts</p>
            <h2 className="text-4xl font-black text-slate-800 mt-2">{stats.totalAttempts}</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Top Score</p>
            <h2 className="text-4xl font-black text-emerald-500 mt-2">{stats.topScore}%</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cheat Alerts</p>
            <h2 className="text-4xl font-black text-red-500 mt-2">{stats.totalIncidents || 0}</h2>
          </div>
        </div>

        {/* Visual Analytics Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Score Distribution</h3>
          <div className="h-80">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Detailed Students Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Student Breakdown</h3>
            <button className="text-indigo-600 font-bold text-sm hover:underline">Export to CSV</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="p-6">Student Name</th>
                <th className="p-6">Score (%)</th>
                <th className="p-6 text-center">Tab Switches</th>
                <th className="p-6">Submission Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-6">
                    <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                    <p className="text-xs text-slate-400">ID: #{s.studentId}</p>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black ${
                      s.score >= 40 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.score}%
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`font-bold ${s.incidents > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {s.incidents || 0}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-slate-500 font-medium">
                    {new Date(s.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FacultyAnalytics;