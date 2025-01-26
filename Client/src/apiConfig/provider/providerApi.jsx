
import axiosInstance from "../axiosInstance";



export const fetchNearbyProviders = async ({ latitude, longitude, distance = 5000 }) => {
  const response = await axiosInstance.get('/providers/nearby', {
    params: { latitude, longitude, distance },
  });
  return response.data.providers;
};
