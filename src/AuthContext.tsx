import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state based on localStorage token
    return Boolean(localStorage.getItem("token"));
  });

  const getAccessToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const getRefreshToken = (): string | null => {
    return localStorage.getItem("refreshToken");
  };

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Ensure `isAuthenticated` stays in sync with the presence of a token
    setIsAuthenticated(Boolean(localStorage.getItem("token")));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getAccessToken, getRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export async function refreshAccessToken(): Promise<string | null> {
 
  const refreshToken = localStorage.getItem("refreshToken");
  if(!refreshToken) return null;
 
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}authentication/refresh`,
    {refresh_token: refreshToken},
    {headers: { "Content-Type": "application/json"}}
  )

    console.log("Refresh response: ", response.data);
    const {access_token, refresh_token} = response.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    return access_token;
  }
  catch (err) {
    console.error("Failed to refresh access token", err);
    return null;
  } 
}


export default { AuthProvider, useAuth };
