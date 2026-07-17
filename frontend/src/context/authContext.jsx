import { createContext, useContext, useState } from "react";
import { loginService } from "../services/auth.services.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginService(credentials);
     
      setUser(response.data.user);
      setIsAuthenticated(true);
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        return {
          success: false,
          message: "Unable to connect to the server.",
        };
      }
     ;
        
      return {
        success: false,
        
        message: error.response?.data?.message|| "Something went wrong.",
      };
    } finally {
      setLoading(false);
    }
  };
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
