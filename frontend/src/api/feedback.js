import axios from 'axios';

const API = axios.create({
  baseURL: "https://feedback-i5do.onrender.com",
});

export const submitFeedback = async (token, feedback) => {
  const res = await API.post('/feedback', feedback, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getFeedbackHistory = async (token, employeeId) => {
  const res = await API.get(`/feedback/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.feedback;
};

export const editFeedback = async (token, feedbackId, updateFields) => {
  const res = await API.put(`/feedback/${feedbackId}`, updateFields, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const acknowledgeFeedback = async (token, feedbackId) => {
  const res = await API.post(`/feedback/${feedbackId}/ack`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 