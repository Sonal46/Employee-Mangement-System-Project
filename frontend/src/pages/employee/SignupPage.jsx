const SignupPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow">
        <h1 className="mb-5 text-2xl font-bold">  Create Account </h1>
        <input className="mb-3 w-full border p-2" placeholder="Name"  />
        <input   className="mb-3 w-full border p-2"    placeholder="Email" />
        <input  className="mb-3 w-full border p-2"  placeholder="Password"  type="password"   />
        <button className="w-full bg-green-700 p-2 text-white">   Signup </button>
      </div>
    </div>
  );
};


export default SignupPage;
