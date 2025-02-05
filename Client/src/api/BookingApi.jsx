import axiosInstance from "./axiosInstance";

export const newBookingApi = async (data) => {
    const res = await axiosInstance.post('/bookings', data);
    return res.data;

};

export const userBookingsApi = async() => {
    const res = await axiosInstance.get("/bookings/my-bookings");
    return res.data;
};

