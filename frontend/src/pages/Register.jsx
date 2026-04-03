import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast } from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role })
      });
      toast.success("Account Created!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC] overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-transparent"></div>
      
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-[480px] border border-slate-100 relative z-10">
        
        <header className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-2">
             <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Join <span className="text-blue-600">SmartEval</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">New Account</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Row 1: Name */}
          <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Aditya Maheshwari"
              className="w-full mt-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Row 2: Email */}
          <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              placeholder="aditya@glau.ac.in"
              className="w-full mt-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Row 3: Password & Role (Flex Row for saving vertical space) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
              <select
                className="w-full mt-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:border-blue-500 outline-none text-sm font-bold text-slate-600 appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-md shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all transform active:scale-95 disabled:bg-slate-200 mt-2"
          >
            {loading ? "Creating Account..." : "Register Now →"}
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs font-medium text-slate-400">
              Already a member?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;