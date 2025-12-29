import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border-t-4 border-medium">
        <h2 className="text-3xl font-bold text-dark mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-medium"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-dark font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-medium"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-dark text-white py-2 rounded font-bold hover:bg-medium transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
