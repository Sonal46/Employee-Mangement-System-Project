import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BriefcaseBusiness, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const roleEmails = {
  admin: "sonal@gmail.com",
  employee: "sourav@gmail.com",
};

const LoginPage = () => {
  const [email,setEmail] = useState(roleEmails.admin);
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("admin");
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    setEmail(roleEmails[selectedRole]);
    setError("");
  };

  const handleLogin = async(e)=>{
    e.preventDefault();
    try{
      const user = await login(
        email.trim().toLowerCase(),
        password
      );
      sessionStorage.setItem("payflow-welcome-pending", "1");

      if(user.role === "admin"){
        navigate("/admin");
      }else{
        navigate("/employee");
      }
    }catch{
      setError("Login failed. Check the selected role, email, password, and API deployment URL.");
    }
  };

return(

<div className="min-h-screen bg-[#eef3f0] px-4 py-6 text-slate-900">
  <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
    <div className="relative hidden bg-slate-950 lg:block">
      <img
        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
        alt="Payroll and HRMS workspace"
        className="h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/12 ring-1 ring-white/20">
          <BriefcaseBusiness size={24} />
        </div>
        <h2 className="text-3xl font-semibold">PayrollPro HRMS</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
          Secure payroll, attendance, employee records, and HR operations in one focused workspace.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-white/15 bg-white/10 p-3 backdrop-blur">
            <p className="font-semibold">Admin</p>
            <p className="mt-1 text-slate-300">sonal@gmail.com</p>
          </div>
          <div className="rounded-md border border-white/15 bg-white/10 p-3 backdrop-blur">
            <p className="font-semibold">Employee</p>
            <p className="mt-1 text-slate-300">sourav@gmail.com</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center px-5 py-10 sm:px-10">
      <form onSubmit={handleLogin} className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <LockKeyhole size={22} />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Secure access</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Payroll Login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with the selected HRMS account.</p>
        </div>

        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="role">Login type</label>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleRoleChange({ target: { value: "admin" } })}
            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-sm font-semibold transition-colors ${role === "admin" ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}
          >
            <ShieldCheck size={16} />
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange({ target: { value: "employee" } })}
            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-sm font-semibold transition-colors ${role === "employee" ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}
          >
            <UsersRound size={16} />
            Employee
          </button>
        </div>
        <select id="role" className="sr-only" value={role} onChange={handleRoleChange}>
          <option value="admin">Admin / HR Login</option>
          <option value="employee">Employee Login</option>
        </select>

        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
        <input
          id="email"
          className="mb-4 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
        <input
          id="password"
          className="mb-5 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="w-full rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800">
          Login
        </button>
        <div className="mt-5 flex justify-between text-sm">
          <Link className="font-medium text-emerald-700 hover:text-emerald-800" to="/forgot-password">Forgot Password?</Link>
          <Link className="font-medium text-emerald-700 hover:text-emerald-800" to="/signup">Create Account</Link>
        </div>
      </form>
    </div>
  </div>
</div>
)
};

export default LoginPage;
