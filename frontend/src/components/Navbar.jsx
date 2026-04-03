import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  // 🛡️ Safe retrieval
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // 1. Pehle data clear karein
    localStorage.clear(); 
    
    // 2. 🚨 CRITICAL FIX: window.location.href use karein
    // Ye poore React application ko kill karke refresh kar deta hai.
    // Isse navigation throttling aur infinite loops turant band ho jayenge.
    window.location.href = "/login";
  };

  // Agar user logged in nahi hai, toh Navbar mat dikhao (Safety check)
  if (!token) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎓</span>
        <h1 
          className="text-xl font-bold tracking-tight cursor-pointer" 
          onClick={() => navigate("/dashboard")}
        >
          SmartEval
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* Links visible to Everyone */}
        <Link to="/dashboard" className="hover:text-blue-200 transition-colors font-medium">
          Dashboard
        </Link>

        {/* Links visible only to STUDENTS */}
        {role === "STUDENT" && (
          <Link to="/history" className="hover:text-blue-200 transition-colors font-medium">
            My History
          </Link>
        )}

        {/* Links visible only to FACULTY or ADMIN */}
        {(role === "FACULTY" || role === "ADMIN") && (
          <div className="flex space-x-6 border-l border-white/30 pl-6">
            <Link 
              to="/faculty/create-question" 
              className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition font-medium"
            >
              + Question
            </Link>
            <Link 
              to="/faculty/create-quiz" 
              className="bg-yellow-400 text-blue-900 px-3 py-1 rounded hover:bg-yellow-300 transition font-bold"
            >
              Create Quiz
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-bold shadow-md transition-transform active:scale-95"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;