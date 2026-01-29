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
import { useMutation } from "@tanstack/react-query";

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
    if (
      !myUser?.isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      handleLogout();
    }
  }, [myUser?.isAuthenticated, pathname, navigate]);

  const loginMutation = useMutation({
    mutationFn: (params: LoginParams) =>
      httpRequest.post(ApiUrl.LOGIN_URL, params),
    onMutate: () => setAuthLoading(true),
    onSuccess: (response) => {
      toast.success("Login Successfully");

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("accessToken", token);
        document.cookie = `api_token=${encodeURIComponent(
          token,
        )}; Path=/; SameSite=Lax`;
      }

      setUser(response.data?.data);
      dispatch(login(response.data?.data));
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login Failed");
    },
    onSettled: () => setAuthLoading(false),
  });

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

  const registerMutation = useMutation({
    mutationFn: async (params: RegisterParams) => {
      const { referral_id, ...payload } = params;
      const referralId = referral_id || "3";
      return httpRequest.post(
        `${ApiUrl.REGISTER_URL}?referral_id=${encodeURIComponent(referralId)}`,
        payload,
      );
    },
    onMutate: () => setAuthLoading(true),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Registration successful");
      navigate("/login", { replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
    onSettled: () => setAuthLoading(false),
  });

  const handleLogin = (params: LoginParams) => {
    loginMutation.mutate(params);
  };

  const handleRegister = (params: RegisterParams) => {
    registerMutation.mutate(params);
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
