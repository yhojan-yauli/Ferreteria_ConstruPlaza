import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Handyman,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import loginBg from '@/assets/login-bg.jpg';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!usuario || !password) {
      setError('Por favor, complete todos los campos');
      setLoading(false);
      return;
    }

    try {
      await login(usuario, password);
      navigate('/ventas');
    } catch (err: any) {
      // Mostrar el mensaje de error específico del backend
      const errorMessage = err?.message || 'Error al conectar con el servidor. Por favor, intenta nuevamente.';
      setError(errorMessage);
      console.error('Error completo en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#f5f7fa',
      }}
    >
      {/* Left Side - Image */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          position: 'relative',
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(30, 58, 95, 0.7) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Handyman sx={{ color: '#f57c00', fontSize: 40 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              Construplaza
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{ color: 'white', fontStyle: 'italic', mb: 2, lineHeight: 1.5 }}
            >
              "Optimizar tu inventario y ventas de ferretería nunca ha sido tan fácil. 
              Bienvenido al futuro de la gestión de la construcción."
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              © 2024 Construplaza Systems Inc.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 450,
            boxShadow: { xs: 'none', md: '0 8px 32px rgba(30, 58, 95, 0.12)' },
            bgcolor: 'white',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Mobile Logo */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 4,
              }}
            >
              <Handyman sx={{ color: '#f57c00', fontSize: 36 }} />
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Construplaza
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
              ¡Bienvenido de nuevo!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Por favor, ingresa tus datos para acceder al panel.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Usuario
              </Typography>
              <TextField
                fullWidth
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Contraseña
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'INGRESAR'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
