import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getTeam = async (token) => {
  const res = await API.get('/team', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 