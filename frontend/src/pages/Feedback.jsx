import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, MenuItem, TextField, Button, Stack, List, ListItem, ListItemText, Chip, Container, Card, CardContent, Divider } from '@mui/material';
import { getMe } from '../api/auth';
import { getTeam } from '../api/team';
import { submitFeedback, getFeedbackHistory, acknowledgeFeedback } from '../api/feedback';

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

export default function Feedback() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ strengths: '', improvements: '', sentiment: 'positive', tags: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userData = await getMe(token);
        setUser(userData);
        if (userData.role === 'manager') {
          const teamData = await getTeam(token);
          setTeam(teamData.team);
          if (teamData.team.length > 0) {
            setSelectedEmployee(teamData.team[0].username);
            const feedbackList = await getFeedbackHistory(token, teamData.team[0].id);
            setFeedbacks(feedbackList);
          }
        } else {
          const feedbackList = await getFeedbackHistory(token, userData.id);
          setFeedbacks(feedbackList);
        }
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleEmployeeChange = async (e) => {
    const username = e.target.value;
    setSelectedEmployee(username);
    try {
      const employee = team.find(emp => emp.username === username);
      if (employee) {
        const feedbackList = await getFeedbackHistory(token, employee.id);
        setFeedbacks(feedbackList);
      }
    } catch (err) {
      setError('Failed to load employee feedback.');
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setSuccess('');
    try {
      const employee = team.find(emp => emp.username === selectedEmployee);
      await submitFeedback(token, {
        employee_id: selectedEmployee,
        strengths: form.strengths,
        improvements: form.improvements,
        sentiment: form.sentiment,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      });
      setSuccess('Feedback submitted successfully!');
      setForm({ strengths: '', improvements: '', sentiment: 'positive', tags: '' });
      // Refresh feedback list
      const feedbackList = await getFeedbackHistory(token, employee.id);
      setFeedbacks(feedbackList);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit feedback.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAcknowledge = async (feedbackId) => {
    try {
      await acknowledgeFeedback(token, feedbackId);
      // Refresh feedback list
      const feedbackList = await getFeedbackHistory(token, user.id);
      setFeedbacks(feedbackList);
    } catch (err) {
      setError('Failed to acknowledge feedback.');
    }
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error" sx={{ fontSize: '1.1rem', p: 3 }}>
          {error}
        </Alert>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          backgroundColor: 'white', 
          borderRadius: 3, 
          border: '1px solid', 
          borderColor: 'grey.200' 
        }}
      >
        <Typography variant="h4" color="text.primary" fontWeight={600} gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Feedback Management
        </Typography>
        
        {user.role === 'manager' && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" color="text.primary" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                Submit Feedback for Team Member
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    select
                    label="Select Employee"
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    {team.map(emp => (
                      <MenuItem key={emp.id} value={emp.username}>{emp.username}</MenuItem>
                    ))}
                  </TextField>
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
                    label="Tags (comma separated)"
                    name="tags"
                    value={form.tags}
                    onChange={handleFormChange}
                    fullWidth
                    placeholder="e.g., leadership, communication, teamwork"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
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
                    {formLoading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                  {success && <Alert severity="success">{success}</Alert>}
                </Stack>
              </form>
            </Box>
            
            <Divider sx={{ my: 4 }} />
          </>
        )}

        {/* Feedback History */}
        <Box>
          <Typography variant="h5" color="text.primary" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            {user.role === 'manager' ? 'Feedback History' : 'Your Feedback History'}
          </Typography>
          
          {feedbacks.length === 0 ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 6, 
                textAlign: 'center',
                backgroundColor: 'grey.50',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No feedback available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role === 'manager' 
                  ? 'Feedback will appear here once submitted for team members.' 
                  : 'Your feedback will appear here once your manager provides it.'
                }
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={4} alignItems="center">
              {feedbacks.map((fb) => (
                <Card
                  key={fb.id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    maxWidth: 700,
                    width: '100%',
                    mx: 'auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft: fb.sentiment === 'positive' ? '6px solid #2e7d32' : fb.sentiment === 'neutral' ? '6px solid #ed6c02' : '6px solid #d32f2f',
                    transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      transform: 'translateY(-4px) scale(1.02)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Chip
                        label={fb.sentiment}
                        color={
                          fb.sentiment === 'positive'
                            ? 'success'
                            : fb.sentiment === 'neutral'
                            ? 'warning'
                            : 'error'
                        }
                        sx={{ mr: 2, fontWeight: 600 }}
                      />
                      {fb.acknowledged && (
                        <Chip
                          label="Acknowledged"
                          color="success"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom>
                      {fb.strengths}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      <strong>Areas to improve:</strong> {fb.improvements}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(fb.timestamp)}
                      </Typography>
                      
                      {!fb.acknowledged && user.role === 'employee' && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleAcknowledge(fb.id)}
                          sx={{ 
                            borderRadius: 24,
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </Box>
                    
                    {fb.tags && fb.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {fb.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 