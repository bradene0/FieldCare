import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Wifi as WifiIcon, WifiOff as WifiOffIcon } from '@mui/icons-material';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 0.5,
        color: isOnline ? '#39FF14' : 'error.main',
        opacity: isOnline ? 1 : 0.8,
      }}
    >
      {isOnline ? (
        <WifiIcon 
          fontSize="small" 
          sx={{ 
            filter: 'drop-shadow(0 0 2px rgba(57, 255, 20, 0.6))',
          }}
        />
      ) : (
        <WifiOffIcon fontSize="small" />
      )}
      <Typography 
        variant="body2" 
        component="span"
        sx={{ 
          display: { xs: 'none', sm: 'inline' },
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {isOnline ? 'Online' : 'Offline'}
      </Typography>
    </Box>
  );
} 