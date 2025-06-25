import axios from 'axios';

const API = axios.create({
  baseURL: "https://feedback-i5do.onrender.com", // Change if backend runs elsewhere
});

export const login = async (username, password) => {
  const res = await API.post('/login', { username, password });
  return res.data;
};

export const register = async (username, password, role, team) => {
  const payload = { username, password, role };
  if (role === 'manager') {
    payload.team = team;
  }
  const res = await API.post('/register', payload);
  return res.data;
};

export const getMe = async (token) => {
  const res = await API.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 