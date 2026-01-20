"use client"
import { login, logout } from "@/reduxstore/authSlice";
import { AuthValuesType, LoginParams, RegisterParams, UserDataType } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiStatus } from "@/config/helper/helper";
import { toast } from "sonner";
import { ApiUrl } from "../api/apiUrls";
import httpRequest from "../api/AxiosInterseptor";
import axios from "axios";


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
    const myUser = useSelector((state: any) => state?.data?.userdata)
    const [user, setUser] = useState<UserDataType | null>(myUser?.isAuthenticated ? myUser?.user : defaultProvider.user);
    const [authLoading, setAuthLoading] = useState(defaultProvider.authLoading)
    const router = useRouter();
    const dispatch = useDispatch();
    const path = usePathname()


    useEffect(() => {
        if (!myUser?.isAuthenticated && path !== "/login") handleLogout()
    }, [router]);

    const handleLogin = async (params: LoginParams) => {
        setAuthLoading(true)
  
    if (params.email == "admin@gmail.com" && params.password == "admin123") {
      let authdata = {
        id: "1",
        email: params.email,
        name: "Admin User",

        role: {
          id: "1",
          name: "Admin",
          value: "super-admin",
          options: [
            { id: "1", name: "Option 1", value: "option1" },
            { id: "2", name: "Option 2", value: "option2" },
          ],
        },
        createdAt: "string",
        updatedAt: "string",
        isAuthenticated: true,
      };
      toast.success("Login Successfully");
      setUser(authdata);
      dispatch(login(authdata));
      router.replace("/" as string);
      setAuthLoading(false);
      return;
    }


    };

    const authCheck = async () => {
          router.replace("/login");
        setUser(null);
        dispatch(logout());
        localStorage.removeItem("persist:root");
        toast.success("Logout Successfully");
    }

    const handleLogout = () => {
        authCheck()
    };

    const handleRegister = (params: RegisterParams) => {
        console.log(params)
    };

    const values = {
        user,
        setUser,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        authLoading,
        setAuthLoading
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
