import axiosInstance from "./axiosInstance";

export const adminLoginApi = ( data ) => {
    const res = axiosInstance.post("/auth/login/admin", data);
    return res;
}