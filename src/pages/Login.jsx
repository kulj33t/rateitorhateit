import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgcolor px-4 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-light/20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-dark mb-2">Welcome Back</h2>
          <p className="text-medium font-medium">
            Sign in to access your library and rankings.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-5 py-3 rounded-xl bg-bgcolor border-2 border-transparent focus:bg-white focus:border-medium focus:ring-0 transition-all outline-none text-dark font-medium placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-sm font-bold text-dark">
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-bgcolor border-2 border-transparent focus:bg-white focus:border-medium focus:ring-0 transition-all outline-none text-dark font-medium placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
          New to RateIt?{" "}
          <Link
            to="/register"
            className="text-medium font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
