import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// Export useAuth for easy access
export const useAuth = () => useContext(AuthContext);

// AuthProvider wrapper component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, check localStorage for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // You can extend with email, etc.
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
    navigate('/todos');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
