import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the app starts
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
      } catch (err) {
        // We log the error to debug, solving the "unused variable" warning
        console.log("Not logged in or session expired:", err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password, name) => {
    const { data } = await api.post('/auth/register', { username, email, password, name });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      // Optional: Tell backend to clear cookie if you have a logout route
      // await api.get('/auth/logout'); 
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
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