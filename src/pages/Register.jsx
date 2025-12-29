import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.name
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgcolor px-4 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-light/20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-dark mb-2">Join RateIt</h2>
          <p className="text-medium font-medium">
            Start tracking and ranking your journey today.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-dark mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full px-5 py-3 rounded-xl bg-bgcolor border-2 border-transparent focus:bg-white focus:border-medium focus:ring-0 transition-all outline-none text-dark font-medium placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              placeholder="johndoe123"
              className="w-full px-5 py-3 rounded-xl bg-bgcolor border-2 border-transparent focus:bg-white focus:border-medium focus:ring-0 transition-all outline-none text-dark font-medium placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

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
            <label className="block text-sm font-bold text-dark mb-2 ml-1">
              Password
            </label>
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
            className="w-full py-4 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all active:scale-95 mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-medium font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
