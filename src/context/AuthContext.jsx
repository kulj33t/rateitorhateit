import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ## Check User Session on Load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      // 1. Check if token exists in LocalStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 2. Verify token with backend (Interceptor attaches the token automatically)
        const { data } = await api.get("/auth/me");
        setUser(data.data);
      } catch (err) {
        // 3. If token is invalid/expired, clear it
        console.log("Session expired:", err.message);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // ## Login Action
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    // Save token manually
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  // ## Register Action
  const register = async (username, email, password, name) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
      name,
    });

    // Save token manually
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  // ## Logout Action
  const logout = async () => {
    try {
      // Optional: call backend if you want to invalidate server-side (if using redis/blacklist)
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      // CRITICAL: Wipe the token from storage
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
