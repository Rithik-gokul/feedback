import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Avatar, Link as MuiLink, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login as loginApi } from '../api/auth';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      onLogin && onLogin({ username, role: data.role });
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'white',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56 }}>
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={600} color="text.primary" mb={1}>
              Sign in
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Stay updated on your professional world
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ 
                mt: 4, 
                py: 1.5, 
                fontWeight: 600, 
                fontSize: '1rem', 
                borderRadius: 24,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              New to Feedback Portal?{' '}
              <MuiLink 
                component={Link} 
                to="/register" 
                color="primary.main" 
                fontWeight={600} 
                underline="hover"
                sx={{ textDecoration: 'none' }}
              >
                Join now
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 