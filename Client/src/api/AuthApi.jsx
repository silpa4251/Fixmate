import axiosInstance from "./axiosInstance";

export const userRegisterApi = ( data ) => {
    const res = axiosInstance.post("/auth/register/user", data);
    return res;
}

export const providerRegisterApi = ( data ) => {
    const res = axiosInstance.post("/auth/register/provider", data);
    return res;
}

export const userLoginApi = ( data ) => {
    const res = axiosInstance.post("/auth/login/user", data);
    return res;
}

export const providerLoginApi = ( data ) => {
    const res = axiosInstance.post("/auth/login/provider", data);
    return res;
}

export const googleAuthApi = ( data ) => {
    const res = axiosInstance.post("/auth/googleauth", data);
    return res;
}

export const logoutApi = () => {
    const res = axiosInstance.post("/auth/log-out");
    return res;
}

export const forgotPasswordApi = ( data ) => {
    const res = axiosInstance.post("/auth/forgot-password", data);
    return res;
}

export const resetPasswordApi = (token,data) => {
    const res = axiosInstance.post(`/auth/reset-password/${token}`,data);
    return res;
}

export const contactApi = (data) => {
    const res = axiosInstance.post("/auth/contact", data);
    return res;
}