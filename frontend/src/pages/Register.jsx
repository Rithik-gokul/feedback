import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, Avatar, Chip, Stack, IconButton, Link as MuiLink, Container, Paper } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddIcon from '@mui/icons-material/Add';
import { register as registerApi, login as loginApi } from '../api/auth';
import { Link } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [team, setTeam] = useState([]); // array of usernames
  const [teamInput, setTeamInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTeam = () => {
    const name = teamInput.trim();
    if (name && !team.includes(name)) {
      setTeam([...team, name]);
    }
    setTeamInput('');
  };

  const handleTeamInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTeam();
    }
  };

  const handleRemoveTeam = (name) => {
    setTeam(team.filter(t => t !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerApi(username, password, role, team);
      // Auto-login after successful registration
      const loginData = await loginApi(username, password);
      localStorage.setItem('token', loginData.access_token);
      localStorage.setItem('role', loginData.role);
      onRegister && onRegister({ username, role });
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
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
            maxWidth: 500,
            backgroundColor: 'white',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar sx={{ bgcolor: 'secondary.main', mb: 2, width: 56, height: 56 }}>
              <PersonAddAltIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={600} color="text.primary" mb={1}>
              Join Feedback Portal
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Make the most of your professional development
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
            <TextField
              select
              label="Role"
              value={role}
              onChange={e => setRole(e.target.value)}
              fullWidth
              margin="normal"
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
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </TextField>
            {role === 'manager' && (
              <Box mt={3}>
                <Typography variant="h6" color="text.primary" fontWeight={600} mb={2}>
                  Team Members
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  <TextField
                    label="Add team member username"
                    variant="outlined"
                    size="small"
                    value={teamInput}
                    onChange={e => setTeamInput(e.target.value)}
                    onKeyDown={handleTeamInputKeyDown}
                    sx={{ 
                      flex: 1,
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
                  <IconButton 
                    color="primary" 
                    onClick={handleAddTeam} 
                    sx={{ 
                      height: 40,
                      width: 40,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '&:hover': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {team.map(name => (
                    <Chip
                      key={name}
                      label={name}
                      onDelete={() => handleRemoveTeam(name)}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
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
              {loading ? 'Creating account...' : 'Join'}
            </Button>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already on Feedback Portal?{' '}
              <MuiLink 
                component={Link} 
                to="/login" 
                color="primary.main" 
                fontWeight={600} 
                underline="hover"
                sx={{ textDecoration: 'none' }}
              >
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 