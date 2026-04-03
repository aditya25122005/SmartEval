import { Link } from "react-router-dom";

function Home() {
  // Check if user is already logged in
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-200">S</div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">SmartEval</span>
        </div>
        
        <div className="flex items-center gap-8 font-bold text-slate-600">
          {!token ? (
            <>
              <Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95">
                Get Started
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
              Go to Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            Next-Gen Assessment Platform
          </div>
          
          <h1 className="text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            Assess with <span className="text-indigo-600">Integrity.</span> <br />
            Analyze with Precision.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
            SmartEval is a robust examination portal built for high-stakes testing. Featuring anti-cheat detection, NTA-standard interfaces, and instant analytical feedback.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {!token ? (
              <>
                <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95">
                  Create Faculty Account
                </Link>
                <Link to="/login" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1 active:scale-95">
                  Join as Student
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95">
                Welcome Back, Open Dashboard →
              </Link>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-1000">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 hover:shadow-2xl hover:bg-white transition-all duration-500 hover:-translate-y-2">
             <div className="text-4xl">🛡️</div>
             <h3 className="font-bold text-slate-800">Anti-Cheat</h3>
             <p className="text-sm text-slate-500">Tab-switch detection and real-time activity logging to ensure fair play.</p>
          </div>
          
          <div className="bg-indigo-600 p-8 rounded-[2rem] text-white space-y-4 mt-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
             <div className="text-4xl">⏱️</div>
             <h3 className="font-bold">NTA Standard</h3>
             <p className="text-sm text-indigo-100 text-opacity-80">JEE-Main style interface for a professional and familiar exam environment.</p>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-4 -mt-4 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
             <div className="text-4xl">📊</div>
             <h3 className="font-bold">Live Stats</h3>
             <p className="text-sm text-slate-400">Instant score calculation, detailed analysis, and global leaderboards.</p>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 mt-4 hover:shadow-2xl hover:bg-white transition-all duration-500 hover:-translate-y-2">
             <div className="text-4xl">🚀</div>
             <h3 className="font-bold">Quick Build</h3>
             <p className="text-sm text-slate-500">Create full assessments in minutes with our integrated local queue builder.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 py-12 text-center">
        <p className="text-slate-400 text-sm mb-2">Designed for Academic Excellence</p>
        <p className="font-bold text-slate-600">Built by Aditya Maheshwari • GLA University • SmartEval 2026</p>
      </footer>
    </div>
  );
}

export default Home;