"use client";
import { login, logout } from "@/reduxstore/authSlice";
import {
  AuthValuesType,
  LoginParams,
  RegisterParams,
  UserDataType,
} from "@/types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ApiUrl } from "../api/apiUrls";
import httpRequest from "../api/AxiosInterseptor";

const defaultProvider: AuthValuesType = {
  user: null,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  authLoading: false,
  setAuthLoading: () => Boolean,
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const myUser = useSelector((state: any) => state?.data?.userdata);
  const [user, setUser] = useState<UserDataType | null>(
    myUser?.isAuthenticated ? myUser?.user : defaultProvider.user,
  );
  const [authLoading, setAuthLoading] = useState(defaultProvider.authLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!myUser?.isAuthenticated && pathname !== "/login") {
      handleLogout();
    }
  }, [myUser?.isAuthenticated, pathname, navigate]);

  const handleLogin = async (params: LoginParams) => {
    setAuthLoading(true);

    try {
      const response = await httpRequest.post(ApiUrl.LOGIN_URL, params);
      toast.success("Login Successfully");
      console.log(response, "RES");

      setUser(response.data?.data);
      dispatch(login(response.data?.data));
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const authCheck = async () => {
    navigate("/login", { replace: true });
    setUser(null);
    dispatch(logout());
    localStorage.removeItem("persist:root");
    toast.success("Logout Successfully");
  };

  const handleLogout = () => {
    authCheck();
  };

  const handleRegister = (params: RegisterParams) => {
    console.log(params);
  };

  const values = {
    user,
    setUser,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    authLoading,
    setAuthLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
