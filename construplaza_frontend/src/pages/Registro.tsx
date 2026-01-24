import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
} from '@mui/material';
import {
  Person,
  Badge,
  Lock,
  Visibility,
  VisibilityOff,
  Handyman,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import loginBg from '@/assets/login-bg.jpg';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre || !dni || !usuario || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    if (dni.length !== 8 || !/^\d+$/.test(dni)) {
      setError('El DNI debe tener 8 dígitos numéricos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = register(nombre, dni, usuario, password);
    if (result) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError('El usuario o DNI ya están registrados');
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
              "Únete al equipo Construplaza y forma parte de la revolución 
              en gestión de ferreterías."
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
              Crear cuenta
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Regístrate como nuevo empleado vendedor.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                ¡Registro exitoso! Redirigiendo al login...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Nombre Completo
              </Typography>
              <TextField
                fullWidth
                placeholder="Juan Pérez García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                DNI
              </Typography>
              <TextField
                fullWidth
                placeholder="12345678"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                inputProps={{ maxLength: 8 }}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Badge sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Usuario
              </Typography>
              <TextField
                fullWidth
                placeholder="Elige un nombre de usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccountCircle sx={{ color: 'text.secondary' }} />
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
                placeholder="Mínimo 6 caracteres"
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
                disabled={success}
                sx={{
                  py: 1.5,
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                  },
                }}
              >
                REGISTRARME
              </Button>
            </form>

            <Typography
              variant="body2"
              sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
            >
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                style={{ color: '#1e3a5f', fontWeight: 600, textDecoration: 'none' }}
              >
                Inicia sesión
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Registro;
