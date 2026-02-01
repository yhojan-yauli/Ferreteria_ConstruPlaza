import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PersonAdd,
  Visibility,
  VisibilityOff,
  Person,
  AccountCircle,
  Badge,
  Lock,
} from '@mui/icons-material';

import { useAuth } from '@/context/AuthContext';
import { userAPI, type User, type CreateUserRequest } from '@/services/api';
import Swal from 'sweetalert2';

const GestionUsuarios: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'VENDEDOR',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userList = await userAPI.listUsers();
      setUsers(userList);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios',
        confirmButtonColor: '#1e3a5f',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
    setSuccess('');
    setFormData({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      role: 'VENDEDOR',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setSuccess('');
    setFormData({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      role: 'VENDEDOR',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.password || !formData.firstname || !formData.lastname) {
      setError('Por favor, complete todos los campos');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      await userAPI.createUser(formData);
      setSuccess('Usuario creado correctamente');
      handleCloseDialog();
      await loadUsers();
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Usuario creado correctamente',
        confirmButtonColor: '#1e3a5f',
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear el usuario');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'VENDEDOR':
        return 'primary';
      case 'ALMACENERO':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'VENDEDOR':
        return 'Vendedor';
      case 'ALMACENERO':
        return 'Almacenero';
      default:
        return role;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Administra los usuarios del sistema Construplaza
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleOpenDialog}
          sx={{ px: 3 }}
        >
          Crear Usuario
        </Button>
      </Box>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Apellido</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No hay usuarios registrados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.firstname}</TableCell>
                        <TableCell>{user.lastname}</TableCell>
                        <TableCell>
                          <Chip
                            label={getRoleLabel(user.role)}
                            color={getRoleColor(user.role) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Crear Nuevo Usuario
            </Typography>
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Apellido"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Usuario"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                helperText="Mínimo 6 caracteres"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
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

              <FormControl fullWidth>
                <InputLabel>Rol del Usuario</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Rol del Usuario"
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as 'VENDEDOR' | 'ALMACENERO' }))}
                >
                  <MenuItem value="VENDEDOR">Vendedor</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 1 }}>
                El usuario será creado con el rol de <strong>{formData.role === 'VENDEDOR' ? 'Vendedor' : 'Almacenero'}</strong>.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Crear Usuario
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default GestionUsuarios;
