import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      // Save credentials
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); 

      toast.success("Welcome back!");
      
      // ✅ Using window.location.href to fully refresh state and avoid route loops
      window.location.href = "/dashboard";

    } catch (err) {
      toast.error("Invalid email or password.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC] overflow-hidden relative">
      
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(30,64,175,0.05)] w-[460px] border border-slate-100 relative z-10 transition-all">
        
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
             <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Smart<span className="text-blue-600">Eval</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Secure Portal Access</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Field */}
          <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Email Address</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-50 text-sm">✉️</span>
              <input
                type="email"
                placeholder="aditya@glau.ac.in"
                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-blue-600">Password</label>
              <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">Forgot?</button>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-50 text-sm">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-slate-200 mt-2"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Authenticating...</span>
              </div>
            ) : "Sign In →"}
          </button>

          {/* Registration Link */}
          <div className="pt-6 text-center border-t border-slate-50">
            <p className="text-sm font-medium text-slate-400">
              New to the platform?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;