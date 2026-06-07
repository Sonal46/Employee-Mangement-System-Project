import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("admin");
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth();
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
      setError("Login failed");
    }
  };

return(

<div className="flex min-h-screen items-center justify-center bg-slate-100">
<form onSubmit={handleLogin} className="w-96 rounded bg-white p-6 shadow">
<div className="mb-5 flex justify-center">
<LockKeyhole/>
</div>

<h1 className="mb-5 text-center text-2xl font-bold"> Payroll Login </h1>
{error &&
<p className="mb-3 text-red-500">{error}</p>}

<select className="mb-3 w-full border p-2" value={role} onChange={(e)=>setRole(e.target.value)}>
<option value="admin">Admin / HR Login</option>
<option value="employee">Employee Login</option>
</select>

<input className="mb-3 w-full border p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
<input className="mb-3 w-full border p-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
<button className="w-full bg-green-700 p-2 text-white">Login</button>
<div className="mt-4 flex justify-between text-sm">
<Link to="/forgot-password">Forgot Password?</Link>
<Link to="/signup">Create Account</Link>
</div>
</form>
</div>
)
};

export default LoginPage;
