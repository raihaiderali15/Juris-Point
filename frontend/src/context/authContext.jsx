import { createContext, useContext, useEffect, useState } from "react";
import {
  forgotPasswordService,
  loginService,
  logoutService,
  registerService,
  resetPasswordService,
} from "../services/auth.services.js";
import { getUserService } from "../services/auth.services.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email,setEmail]=useState(null)
  useEffect(() => {
    getUserProfile();
  }, []);
  const emailStore=(email)=>{
    setEmail(email)
  }
  //Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginService(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return {
        success: true,
        message: response?.data?.message,
        user: response?.data?.data?.user,
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
      setIsAuthenticated(true);

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
  const logoutUser = async () => {
    try {
      setLoading(true);
      const response = await logoutService();
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: true,
        message: response?.data?.message || "logout successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    } finally {
      setLoading(false);
    }
  };
  //create or register user
  const register = async (data) => {
    try {
      const response = await registerService(data);
      return {
        success: true,
        message: response.data?.message,
        user: response.data?.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  };
  const forgotPassword = async (data) => {
    try {
      const response = await forgotPasswordService(data);
  
      return {
        success: response?.data?.success,
        message: response.data?.message,
      };
    } catch (error) {
      console.log(error.response);
      return {
        success: error?.response?.success,
        message: error?.response?.data?.message || "Something went wrong",
      };
    }
  };
  const resetPassword=async(data)=>{
    try {
        const response = await resetPasswordService(data)
        console.log(response)
        return{
          success:response?.data?.success,
          message:response?.data?.message
        }
    } catch (error) {
      console.log(error.response.data.message)
      return{
        success:error?.response?.data?.success,
        message:error?.response?.data?.message


      }
    }
  }
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    getUserProfile,
    logoutUser,
    register,
    forgotPassword,
    resetPassword,
    emailStore,
    email
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
