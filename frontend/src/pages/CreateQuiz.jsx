import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";

function CreateQuiz() {
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    duration: 30,
    startTime: "",
    endTime: ""
  });

  // Fetch Questions from Database
  const fetchQuestions = async () => {
    try {
      const data = await apiFetch("/api/faculty/questions");
      setAvailableQuestions(data || []);
    } catch (err) {
      toast.error("Failed to load question bank");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions based on search
  const filteredQuestions = availableQuestions.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.subject && q.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleQuestionSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLaunchQuiz = async () => {
    if (!quizData.title) return toast.error("Quiz title is required!");
    if (selectedIds.length === 0) return toast.error("Select at least one question!");
    
    try {
      await apiFetch("/api/faculty/quizzes", {
        method: "POST",
        body: JSON.stringify({ ...quizData, questionIds: selectedIds })
      });
      toast.success("Quiz published successfully! 🚀");
      // Reset after success
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-[1700px] mx-auto p-6 grid lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        
        {/* --- LEFT: QUIZ CONFIG (3 Cols) --- */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
               <span className="w-2 h-8 bg-indigo-600 rounded-full"></span> Setup Quiz
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input type="text" placeholder="e.g. Java Midterm" className="w-full mt-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  onChange={(e) => setQuizData({...quizData, title: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Instructions</label>
                <textarea placeholder="Important rules..." className="w-full mt-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                  onChange={(e) => setQuizData({...quizData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                  <input type="number" placeholder="Min" className="w-full mt-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl" 
                    onChange={(e) => setQuizData({...quizData, duration: Number(e.target.value)})} />
                </div>
                <div className="flex items-end">
                   <p className="text-slate-400 text-xs pb-4 italic">Minutes</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Starts At</label>
                <input type="datetime-local" className="w-full mt-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl" 
                  onChange={(e) => setQuizData({...quizData, startTime: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ends At</label>
                <input type="datetime-local" className="w-full mt-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl" 
                  onChange={(e) => setQuizData({...quizData, endTime: e.target.value})} />
              </div>
            </div>
          </div>

          <button onClick={handleLaunchQuiz} className="w-full bg-indigo-600 text-white p-6 rounded-[2rem] font-black text-lg hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all active:scale-95">
            Launch Assessment 🚀
          </button>
        </div>

        {/* --- MIDDLE: QUESTION BANK (5 Cols) --- */}
        <div className="lg:col-span-5 bg-white rounded-[3rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-black text-slate-800">Question Bank</h2>
               <span className="text-xs bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-500 uppercase tracking-widest">Database Store</span>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by topic or title..." 
                className="w-full bg-slate-50 border-none p-5 pl-12 rounded-3xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔍</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
              <div 
                key={q.id} 
                onClick={() => toggleQuestionSelection(q.id)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                  selectedIds.includes(q.id) 
                  ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20' 
                  : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        {q.subject || "General"}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-slate-400 text-xs font-bold">{q.difficulty || "Medium"}</span>
                    </div>
                    <p className="font-bold text-slate-800 leading-tight">{q.title}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 bg-white'
                  }`}>
                    {selectedIds.includes(q.id) && "✓"}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 opacity-30 font-bold">No questions found matching your search.</div>
            )}
          </div>
        </div>

        {/* --- RIGHT: SELECTION QUEUE (4 Cols) --- */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black">Final Queue</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ready for Launch</p>
            </div>
            <div className="bg-indigo-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl">
              {selectedIds.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {selectedIds.length > 0 ? (
              availableQuestions.filter(q => selectedIds.includes(q.id)).map((q, idx) => (
                <div key={q.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-indigo-400 font-black text-sm">{idx + 1}.</span>
                    <p className="text-sm font-bold text-slate-200 line-clamp-1">{q.title}</p>
                  </div>
                  <button 
                    onClick={() => toggleQuestionSelection(q.id)}
                    className="text-slate-500 hover:text-red-400 text-xs font-black uppercase tracking-tighter px-2"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                 <span className="text-6xl mb-4">📥</span>
                 <p className="font-bold">Select questions from the bank</p>
              </div>
            )}
          </div>

          <div className="p-8 bg-white/5 mt-auto">
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                <span>Estimated Time:</span>
                <span className="text-indigo-400">{quizData.duration} Mins</span>
             </div>
             <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all" style={{ width: `${Math.min(selectedIds.length * 10, 100)}%` }}></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreateQuiz;