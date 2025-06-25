import axios from 'axios';

const API = axios.create({
  baseURL: "https://feedback-i5do.onrender.com",
});

export const getTeam = async (token) => {
  const res = await API.get('/team', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 