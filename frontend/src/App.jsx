import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a66c2', // LinkedIn blue
      light: '#0073b1',
      dark: '#004182',
    },
    secondary: {
      main: '#057642', // LinkedIn green
      light: '#0a8c4a',
      dark: '#045c35',
    },
    background: {
      default: '#f3f2ef', // LinkedIn background
      paper: '#ffffff',
    },
    text: {
      primary: '#191919', // LinkedIn dark text
      secondary: '#666666', // LinkedIn secondary text
    },
    grey: {
      50: '#f9f9f9',
      100: '#f3f2ef',
      200: '#e0e0e0',
      300: '#c7c7c7',
      400: '#a8a8a8',
      500: '#666666',
      600: '#191919',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 24,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function LoginWithRedirect() {
  const navigate = useNavigate();
  return <Login onLogin={() => navigate('/dashboard')} />;
}

function RegisterWithRedirect() {
  const navigate = useNavigate();
  return <Register onRegister={() => navigate('/dashboard')} />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginWithRedirect />} />
        <Route path="/register" element={<RegisterWithRedirect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}
