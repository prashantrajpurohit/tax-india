import axios from "axios";
import { toast } from "sonner";
import { ApiStatus } from "@/helper/helper";
import { ApiUrl } from "./apiUrls";
const httpRequest = axios.create({
  withCredentials: true,
  baseURL: ApiUrl.BASE_URL,
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
httpRequest.interceptors.response.use(
  (response) => {
    const status = response?.status;
    const message = response?.data?.message;

    switch (status) {
      case ApiStatus.STATUS_201:
        toast.success(message);
        return response;
      default:
        return response;
    }
  },
  (error) => {
    const response = error?.response;
    const status = response?.status;
    const message = response?.data?.message;

    switch (status) {
      case ApiStatus.STATUS_403:
        toast.error("Access Denied");
        break;
      case ApiStatus.STATUS_422:
        toast.error("Validation Error: " + (message || "Invalid data."));
        break;
      default:
        toast.error(message || "Something went wrong.");
        break;
    }

    return Promise.reject(error);
  },
);

export default httpRequest;
