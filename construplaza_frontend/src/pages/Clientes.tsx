import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Person,
  Business,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { clientesMock, Cliente } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';

const Clientes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'TODOS' | 'PERSONA' | 'EMPRESA'>('TODOS');
  const [clientesState, setClientesState] = useState<Cliente[]>(clientesMock);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'DNI' as 'DNI' | 'RUC',
    numeroDocumento: '',
    direccion: '',
    telefono: '',
    email: '',
    tipoCliente: 'PERSONA' as 'PERSONA' | 'EMPRESA',
  });

  const clientesFiltrados = clientesState.filter((c) => {
    const matchBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.numeroDocumento.includes(busqueda) ||
      c.email.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = tipoFiltro === 'TODOS' || c.tipoCliente === tipoFiltro;
    return matchBusqueda && matchTipo;
  });

  const totalClientes = clientesState.length;
  const clientesPersona = clientesState.filter((c) => c.tipoCliente === 'PERSONA').length;
  const clientesEmpresa = clientesState.filter((c) => c.tipoCliente === 'EMPRESA').length;

  const handleOpenDialog = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        tipoDocumento: cliente.tipoDocumento,
        numeroDocumento: cliente.numeroDocumento,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        email: cliente.email,
        tipoCliente: cliente.tipoCliente,
      });
    } else {
      setEditingCliente(null);
      setFormData({
        nombre: '',
        apellido: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        direccion: '',
        telefono: '',
        email: '',
        tipoCliente: 'PERSONA',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCliente(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      if (name === 'tipoCliente') {
        setFormData((prev) => ({
          ...prev,
          tipoDocumento: value === 'EMPRESA' ? 'RUC' : 'DNI',
        }));
      }
    }
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.numeroDocumento) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete los campos obligatorios',
        confirmButtonColor: '#1e3a5f',
      });
      return;
    }

    if (editingCliente) {
      setClientesState((prev) =>
        prev.map((c) =>
          c.id === editingCliente.id
            ? { ...c, ...formData }
            : c
        )
      );
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'El cliente ha sido actualizado correctamente.',
        confirmButtonColor: '#1e3a5f',
      });
    } else {
      const newCliente: Cliente = {
        id: Math.max(...clientesState.map((c) => c.id)) + 1,
        ...formData,
        fechaRegistro: new Date().toISOString().split('T')[0],
      };
      setClientesState((prev) => [...prev, newCliente]);
      Swal.fire({
        icon: 'success',
        title: '¡Creado!',
        text: 'El cliente ha sido creado correctamente.',
        confirmButtonColor: '#1e3a5f',
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setClientesState((prev) => prev.filter((c) => c.id !== id));
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El cliente ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#1e3a5f',
        });
      }
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Gestión de Clientes
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Administra los clientes de Construplaza
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total Clientes
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalClientes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Personas Naturales
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {clientesPersona}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Business sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Empresas
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {clientesEmpresa}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y Búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, documento o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Cliente</InputLabel>
                <Select
                  value={tipoFiltro}
                  label="Tipo de Cliente"
                  onChange={(e) => setTipoFiltro(e.target.value as 'TODOS' | 'PERSONA' | 'EMPRESA')}
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="PERSONA">Persona Natural</MenuItem>
                  <MenuItem value="EMPRESA">Empresa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  py: 1.5,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                + NUEVO CLIENTE
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de Clientes */}
      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CLIENTE</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>DOCUMENTO</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CONTACTO</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TIPO</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  ACCIONES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(30, 58, 95, 0.04)' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      #{cliente.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cliente.nombre} {cliente.apellido}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {cliente.direccion}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {cliente.tipoDocumento}: {cliente.numeroDocumento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{cliente.telefono}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{cliente.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={cliente.tipoCliente === 'PERSONA' ? <Person /> : <Business />}
                      label={cliente.tipoCliente === 'PERSONA' ? 'Persona' : 'Empresa'}
                      size="small"
                      color={cliente.tipoCliente === 'PERSONA' ? 'primary' : 'warning'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(cliente)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    {isAdmin && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(cliente.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Mostrando {clientesFiltrados.length} de {totalClientes} clientes
          </Typography>
        </Box>
      </Card>

      {/* Dialog para Crear/Editar Cliente */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Cliente</InputLabel>
                <Select
                  name="tipoCliente"
                  value={formData.tipoCliente}
                  label="Tipo de Cliente"
                  onChange={handleInputChange as any}
                >
                  <MenuItem value="PERSONA">Persona Natural</MenuItem>
                  <MenuItem value="EMPRESA">Empresa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Documento</InputLabel>
                <Select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  label="Tipo de Documento"
                  onChange={handleInputChange as any}
                >
                  <MenuItem value="DNI">DNI</MenuItem>
                  <MenuItem value="RUC">RUC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formData.tipoCliente === 'EMPRESA' ? 'Razón Social' : 'Nombre'}
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formData.tipoCliente === 'EMPRESA' ? 'Tipo de Sociedad (S.A.C., E.I.R.L., etc.)' : 'Apellido'}
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Número de ${formData.tipoDocumento}`}
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleInputChange}
                required
                inputProps={{
                  maxLength: formData.tipoDocumento === 'DNI' ? 8 : 11,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editingCliente ? 'Actualizar' : 'Crear Cliente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clientes;
