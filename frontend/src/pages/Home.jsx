import React from 'react';
import { Box, Typography, Stack, Button, Paper, Container, Grid, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Home() {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Typography variant="h4" color="primary.main" fontWeight={700}>
              Feedback Portal
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                component={Link} 
                to="/login" 
                variant="text" 
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Sign in
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained" 
                color="primary"
                sx={{ 
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 24,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Join now
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" color="text.primary" fontWeight={600} gutterBottom>
              Build stronger teams through meaningful feedback
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.4 }}>
              Connect managers and employees with structured, ongoing feedback that drives growth and improves performance.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ 
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 24,
                  fontSize: '1.1rem',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Get started
              </Button>
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ 
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 24,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
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
              <Typography variant="h5" color="text.primary" fontWeight={600} gutterBottom>
                Why choose Feedback Portal?
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <WorkIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Structured Feedback
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consistent, actionable feedback that drives improvement
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Team Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Easy team oversight and performance tracking
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Growth Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track progress and identify development opportunities
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 