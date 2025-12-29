import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border-t-4 border-light">
        <h2 className="text-3xl font-bold text-dark mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 border rounded focus:border-light outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-dark font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full p-2 border rounded focus:border-light outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-dark font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border rounded focus:border-light outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-dark font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border rounded focus:border-light outline-none"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-medium text-white py-2 rounded font-bold hover:bg-dark transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
