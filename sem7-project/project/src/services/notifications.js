import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const getNotifications = async (userId) => {
  const res = await axios.get(`${API}/notifications/${userId}`);
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await axios.patch(`${API}/notifications/${id}/read`);
  return res.data;
};