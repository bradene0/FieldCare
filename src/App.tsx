import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { PatientList } from './components/PatientList'
import { NetworkStatus } from './components/NetworkStatus'
import { DatabaseProvider } from './db/DatabaseContext'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginPage } from './components/LoginPage'

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }
      }
    }
  }
})

function AppContent() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f5f5',
      overflow: 'hidden',
    }}>
      <AppBar 
        position="static" 
        sx={{ 
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: '#1976d2',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 4 } }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: '1.25rem',
              fontWeight: 500,
              letterSpacing: '0.0075em',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            FieldCare
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                ml: 2,
                fontSize: '0.875rem',
              }}
            >
              {user.email}
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NetworkStatus />
            <IconButton 
              color="inherit" 
              onClick={logout}
              sx={{ 
                opacity: 0.7,
                '&:hover': {
                  opacity: 1,
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          width: '100%',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          px: { xs: 2, sm: 4 },
          py: 3,
        }}
      >
        <PatientList />
      </Box>
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DatabaseProvider>
          <AppContent />
        </DatabaseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
