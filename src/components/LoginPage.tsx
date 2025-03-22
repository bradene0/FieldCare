import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { signInWithGoogle, error } = useAuth();

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 500,
            mb: 3,
          }}
        >
          FieldCare
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          Sign in to access your patient records and manage visits
        </Typography>

        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            bgcolor: '#fff',
            color: 'rgba(0, 0, 0, 0.87)',
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
        >
          Sign in with Google
        </Button>

        {error && (
          <Typography 
            color="error" 
            sx={{ mt: 2 }}
          >
            {error}
          </Typography>
        )}

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 4,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          This is a secure application. Your data is protected and only accessible to authorized healthcare providers.
        </Typography>
      </Paper>
    </Container>
  );
} 