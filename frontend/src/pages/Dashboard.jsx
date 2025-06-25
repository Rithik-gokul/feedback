import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Grid,
  Modal,
  TextField,
  MenuItem,
  Stack,
  List,
  ListItem,
  ListItemText,
  Container,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getMe } from "../api/auth";
import { getTeam } from "../api/team";
import {
  submitFeedback,
  getFeedbackHistory,
  acknowledgeFeedback,
  editFeedback,
} from "../api/feedback";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: '90vw',
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto'
};

// Safe date formatting function
const formatDate = (timestamp) => {
  if (!timestamp) return "No date";
  try {
    // Handle different timestamp formats
    let date;
    if (typeof timestamp === 'string') {
      // If it's already a string, try to parse it
      date = new Date(timestamp);
    } else if (timestamp.$date) {
      // Handle MongoDB date format
      date = new Date(timestamp.$date);
    } else {
      // Try direct conversion
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      return "Invalid date";
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error, timestamp);
    return "Invalid date";
  }
};

function getSentimentSummary(feedbacksByMember) {
  let total = 0;
  let positive = 0,
    neutral = 0,
    negative = 0;
  Object.values(feedbacksByMember).forEach((list) => {
    list.forEach((fb) => {
      total++;
      if (fb.sentiment === "positive") positive++;
      else if (fb.sentiment === "neutral") neutral++;
      else if (fb.sentiment === "negative") negative++;
    });
  });
  return { total, positive, neutral, negative };
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState({}); 
  const [form, setForm] = useState({
    strengths: "",
    improvements: "",
    sentiment: "positive",
    tags: [],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [empFeedbacks, setEmpFeedbacks] = useState([]); 
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFeedbackData, setEditFeedbackData] = useState(null);
  const [editForm, setEditForm] = useState({
    strengths: "",
    improvements: "",
    sentiment: "positive",
    tags: [],
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const userData = await getMe(token);
        setUser(userData);
        if (userData.role === "manager") {
          const teamData = await getTeam(token);
          setTeam(teamData.team);
          // Preload feedbacks for all team members
          const feedbackObj = {};
          for (const emp of teamData.team) {
            feedbackObj[emp.id] = await getFeedbackHistory(token, emp.id);
          }
          setFeedbacks(feedbackObj);
        } else {
          // Employee: fetch their own feedbacks
          setEmpLoading(true);
          const feedbackList = await getFeedbackHistory(token, userData.id);
          setEmpFeedbacks(feedbackList);
          setEmpLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load dashboard.");
        setEmpError(err.response?.data?.msg || "Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  function setTagValue() {
    const tagDetail = tagInput.trim();
    if (tagDetail && !form.tags.includes(tagDetail)) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagDetail]
      }));
    }
    setTagInput('');
  }

  function handleTagInputKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      setTagValue();
    }
  }

  function removeTag(tagToRemove) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }

  function setEditTagValue() {
    const tagDetail = editTagInput.trim();
    if (tagDetail && !editForm.tags.includes(tagDetail)) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagDetail]
      }));
    }
    setEditTagInput('');
  }

  function handleEditTagInputKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditTagValue();
    }
  }

  function removeEditTag(tagToRemove) {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }

  // Feedback Edit
  const handleOpenEditModal = (fb, emp) => {
    setEditFeedbackData({ ...fb, emp });
    setEditForm({
      strengths: fb.strengths,
      improvements: fb.improvements,
      sentiment: fb.sentiment,
      tags: fb.tags || [],
    });
    setEditTagInput("");
    setEditSuccess("");
    setEditError("");
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditFeedbackData(null);
  };
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess("");
    setEditError("");
    try {
      const token = localStorage.getItem("token");
      await editFeedback(token, editFeedbackData.id, {
        strengths: editForm.strengths,
        improvements: editForm.improvements,
        sentiment: editForm.sentiment,
        tags: editForm.tags,
      });
      setEditSuccess("Feedback updated!");
      // Refresh feedbacks for this employee
      const newFeedbacks = await getFeedbackHistory(
        token,
        editFeedbackData.emp.id
      );
      setFeedbacks((prev) => ({
        ...prev,
        [editFeedbackData.emp.id]: newFeedbacks,
      }));
    } catch (err) {
      setEditError(err.response?.data?.msg || "Failed to update feedback.");
    } finally {
      setEditLoading(false);
    }
  };

  // Feedback Modal (Give Feedback)
  const handleOpenModal = (emp) => {
    setSelectedEmp(emp);
    setForm({
      strengths: "",
      improvements: "",
      sentiment: "positive",
      tags: [],
    });
    setFormSuccess("");
    setFormError("");
    setTagInput("");
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmp(null);
  };
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess("");
    setFormError("");
    try {
      const token = localStorage.getItem("token");
      await submitFeedback(token, {
        employee_id: selectedEmp.username,
        strengths: form.strengths,
        improvements: form.improvements,
        sentiment: form.sentiment,
        tags: form.tags,
      });
      setFormSuccess("Feedback submitted!");
      // Refresh feedbacks for this employee
      const newFeedbacks = await getFeedbackHistory(token, selectedEmp.id);
      setFeedbacks((prev) => ({ ...prev, [selectedEmp.id]: newFeedbacks }));
      setForm({
        strengths: "",
        improvements: "",
        sentiment: "positive",
        tags: [],
      });
      setTagInput("");
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to submit feedback.");
    } finally {
      setFormLoading(false);
    }
  };

  // Employee feedback acknowledge
  const handleAcknowledge = async (feedbackId) => {
    setEmpLoading(true);
    setEmpError("");
    try {
      const token = localStorage.getItem("token");
      await acknowledgeFeedback(token, feedbackId);
      // Refresh feedbacks
      const feedbackList = await getFeedbackHistory(token, user.id);
      setEmpFeedbacks(feedbackList);
    } catch (err) {
      setEmpError("Failed to acknowledge feedback.");
    } finally {
      setEmpLoading(false);
    }
  };

  if (loading)
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Alert severity="error" sx={{ fontSize: '1.1rem', p: 3 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );

  // Feedback summary for manager
  const summary =
    user?.role === "manager" ? getSentimentSummary(feedbacks) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section with Logout */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography
            variant="h3"
            color="text.primary"
            fontWeight={600}
            gutterBottom
          >
            Welcome back, {user.username}!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={user.role.toUpperCase()}
              color={user.role === "manager" ? "primary" : "secondary"}
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.9rem', 
                px: 3, 
                py: 1,
                borderRadius: 2
              }}
            />
            {user.role === "manager" && (
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Manager • {user.username}
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          sx={{ 
            fontWeight: 600, 
            borderRadius: 24,
            px: 3,
            py: 1.5,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          Sign out
        </Button>
      </Box>

      {/* Manager Dashboard */}
      {user.role === "manager" && (
        <>
          {/* Summary Card */}
          {summary && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                mb: 4, 
                backgroundColor: 'white',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WorkIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={600} color="text.primary">
                  Team Overview
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {summary.total}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Feedback
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Chip 
                      label={`${summary.positive} Positive`} 
                      color="success" 
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip 
                      label={`${summary.neutral} Neutral`} 
                      color="warning" 
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip 
                      label={`${summary.negative} Negative`} 
                      color="error" 
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Team Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              color="text.primary"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 3, textAlign: 'center' }}
            >
              Your Team
            </Typography>
            {team.length === 0 ? (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  backgroundColor: 'white',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <PersonIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No team members yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Team members will appear here once they register
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {team.map((member) => (
                  <Grid item xs={12} sm={6} md={6} key={member.id}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        minWidth: 340,
                        maxWidth: 500,
                        mx: 'auto',
                        height: '100%',
                        transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        borderLeft: `6px solid ${theme => theme.palette.primary.main}`,
                        '&:hover': {
                          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                          transform: 'translateY(-4px) scale(1.03)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              width: 64,
                              height: 64,
                              mb: 2,
                              fontSize: '1.5rem'
                            }}
                          >
                            {member.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="text.primary"
                            textAlign="center"
                          >
                            {member.username}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ 
                            mb: 3,
                            borderRadius: 24,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none'
                          }}
                          onClick={() => handleOpenModal(member)}
                        >
                          Give Feedback
                        </Button>

                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" color="text.secondary" mb={2} textAlign="center">
                          Recent Feedback
                        </Typography>
                        
                        {feedbacks[member.id] && feedbacks[member.id].length > 0 ? (
                          <Box sx={{ 
                            maxHeight: 200, 
                            overflow: 'auto',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.200',
                            bgcolor: 'grey.50',
                            '&::-webkit-scrollbar': {
                              width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: 'rgba(0,0,0,0.2)',
                              borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                              background: 'rgba(0,0,0,0.3)',
                            }
                          }}>
                            {feedbacks[member.id].slice(0, 3).map((fb) => (
                              <Box key={fb.id} sx={{ 
                                p: 2, 
                                borderBottom: '1px solid',
                                borderColor: 'grey.200',
                                '&:last-child': {
                                  borderBottom: 'none'
                                },
                                '&:hover': {
                                  bgcolor: 'grey.100'
                                }
                              }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Chip
                                    label={fb.sentiment}
                                    color={
                                      fb.sentiment === "positive"
                                        ? "success"
                                        : fb.sentiment === "neutral"
                                        ? "warning"
                                        : "error"
                                    }
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                  />
                                  <Button
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleOpenEditModal(fb, member)}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                  >
                                    Edit
                                  </Button>
                                </Box>
                                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, mb: 1 }}>
                                  {fb.strengths}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(fb.timestamp)}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography color="text.secondary" textAlign="center" sx={{ fontStyle: 'italic' }}>
                            No feedback yet
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}

      {/* Employee Dashboard */}
      {user.role === "employee" && (
        <Box>
          <Typography
            variant="h4"
            color="text.primary"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Your Feedback Timeline
          </Typography>
          
          {empLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={300}
            >
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Loading your feedback...
                </Typography>
              </Box>
            </Box>
          ) : empError ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Alert severity="error" sx={{ fontSize: '1.1rem', p: 3 }}>
                {empError}
              </Alert>
            </Paper>
          ) : empFeedbacks.length === 0 ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 8, 
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 80, color: 'grey.400', mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                No feedback yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                Your manager will provide feedback here to help you grow and improve. 
                Check back regularly for updates!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {empFeedbacks.map((fb, index) => (
                <Grid item xs={12} md={8} key={fb.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      maxWidth: 700,
                      width: '100%',
                      mx: 'auto',
                      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      borderLeft: fb.sentiment === 'positive' ? '6px solid #2e7d32' : fb.sentiment === 'neutral' ? '6px solid #ed6c02' : '6px solid #d32f2f',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                        transform: 'translateY(-4px) scale(1.02)',
                        borderColor: 'primary.main'
                      },
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Feedback Number Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      zIndex: 1
                    }}>
                      #{empFeedbacks.length - index}
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      {/* Header with Sentiment and Status */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Chip
                          label={fb.sentiment}
                          color={
                            fb.sentiment === "positive"
                              ? "success"
                              : fb.sentiment === "neutral"
                              ? "warning"
                              : "error"
                          }
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            px: 2,
                            py: 1
                          }}
                        />
                        {fb.acknowledged ? (
                          <Chip
                            label="✓ Acknowledged"
                            color="success"
                            variant="outlined"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              px: 2,
                              py: 1
                            }}
                          />
                        ) : (
                          <Chip
                            label="Pending Acknowledgment"
                            color="warning"
                            variant="outlined"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              px: 2,
                              py: 1
                            }}
                          />
                        )}
                      </Box>
                      
                      {/* Main Feedback Content */}
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{
                          p: 3,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          mb: 2
                        }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                            Strengths:
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {fb.strengths}
                          </Typography>
                        </Box>
                        <Box sx={{
                          p: 3,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'grey.200'
                        }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                            Areas for Improvement:
                          </Typography>
                          <Typography variant="body1" color="text.primary">
                            {fb.improvements}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Tags Section */}
                      {fb.tags && fb.tags.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                            Focus Areas:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {fb.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ 
                                  fontWeight: 500,
                                  fontSize: '0.75rem'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {/* Footer with Date and Action */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'grey.200'
                      }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Received on
                          </Typography>
                          <Typography variant="body2" color="text.primary" fontWeight={500}>
                            {formatDate(fb.timestamp)}
                          </Typography>
                        </Box>
                        
                        {!fb.acknowledged && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAcknowledge(fb.id)}
                            sx={{ 
                              borderRadius: 24,
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 3,
                              py: 1
                            }}
                          >
                            Acknowledge Feedback
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Feedback Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="feedback-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="feedback-modal-title"
            variant="h5"
            fontWeight={600}
            color="text.primary"
            mb={3}
            textAlign="center"
          >
            Give Feedback to {selectedEmp?.username}
          </Typography>
          <form onSubmit={handleSubmitFeedback} autoComplete="off">
            <Stack spacing={3}>
              <TextField
                label="Strengths"
                name="strengths"
                value={form.strengths}
                onChange={handleFormChange}
                fullWidth
                required
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Areas to Improve"
                name="improvements"
                value={form.improvements}
                onChange={handleFormChange}
                fullWidth
                required
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                select
                label="Overall Sentiment"
                name="sentiment"
                value={form.sentiment}
                onChange={handleFormChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="positive">Positive</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
                <MenuItem value="negative">Negative</MenuItem>
              </TextField>
              <TextField
                label="Tags"
                name="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                fullWidth
                placeholder="Type a tag and press Enter"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              {form.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formLoading}
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: 24,
                  py: 1.5,
                  textTransform: 'none'
                }}
              >
                {formLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
              {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
              {formError && <Alert severity="error">{formError}</Alert>}
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Feedback Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-feedback-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="edit-feedback-modal-title"
            variant="h5"
            fontWeight={600}
            color="text.primary"
            mb={3}
            textAlign="center"
          >
            Edit Feedback for {editFeedbackData?.emp?.username}
          </Typography>
          <form onSubmit={handleEditSubmit} autoComplete="off">
            <Stack spacing={3}>
              <TextField
                label="Strengths"
                name="strengths"
                value={editForm.strengths}
                onChange={handleEditFormChange}
                fullWidth
                required
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                label="Areas to Improve"
                name="improvements"
                value={editForm.improvements}
                onChange={handleEditFormChange}
                fullWidth
                required
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                select
                label="Overall Sentiment"
                name="sentiment"
                value={editForm.sentiment}
                onChange={handleEditFormChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="positive">Positive</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
                <MenuItem value="negative">Negative</MenuItem>
              </TextField>
              <TextField
                label="Tags"
                name="editTagInput"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={handleEditTagInputKeyDown}
                fullWidth
                placeholder="Type a tag and press Enter"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              {editForm.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {editForm.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeEditTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={editLoading}
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: 24,
                  py: 1.5,
                  textTransform: 'none'
                }}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
              {editSuccess && <Alert severity="success">{editSuccess}</Alert>}
              {editError && <Alert severity="error">{editError}</Alert>}
            </Stack>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
