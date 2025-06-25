import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        color="default" 
        elevation={0} 
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            px: 0,
            py: 1
          }}>
            <Typography 
              variant="h5" 
              color="primary.main" 
              fontWeight={700}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              Feedback Portal
            </Typography>
            {localStorage.getItem('token') && (
              <Button 
                color="primary" 
                variant="outlined" 
                onClick={handleLogout} 
                sx={{ 
                  fontWeight: 600, 
                  borderRadius: 24,
                  px: 3,
                  py: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Sign out
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ py: 3 }}>
        {children}
      </Box>
    </Box>
  );
} 