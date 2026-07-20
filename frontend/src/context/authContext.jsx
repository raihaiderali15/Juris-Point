import { createContext, useContext, useEffect, useState } from "react";
import { loginService, logoutService } from "../services/auth.services.js";
import { getUserService } from "../services/auth.services.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUserProfile();
  }, []);
  //Login function
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
      return {
        success: false,

        message: error.response?.data?.message || "Something went wrong.",
      };
    } finally {
      setLoading(false);
    }
  };
  // get user Profile function
  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserService();
      setUser(response.data.user);
      setIsAuthenticated(true)
  
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return {
        success: false,
        message: error.response?.data?.message || "Something Went Wrong",
      };
    } finally {
      setLoading(false);
    }
  };
//Logout User
const logoutUser=async()=>{
  try {
    setLoading(true)
    const response= await logoutService();
    setUser(null);
    setIsAuthenticated(false)
    return{
      success:true,
      message:response?.data?.message||"logout successfully"
    }
  } catch (error) {
    return{
      success:false,
      message:error.response?.data?.message || "Something went wrong."
    }
  }finally{
    setLoading(false)
  }
}

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    getUserProfile,
    logoutUser
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
