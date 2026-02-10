import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);
  

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
