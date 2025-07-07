"use client";
 
import { createContext, useContext, useEffect, useState } from "react";
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const refreshUser = () => {
    const stored = localStorage.getItem("jobraze-user");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("jobraze-user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };
 
  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, []);
 
  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export const useAuth = () => useContext(AuthContext);
 
 