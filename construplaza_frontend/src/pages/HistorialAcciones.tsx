import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
} from '@mui/material';
import {
  FilterList,
  ShoppingCart,
  PersonAdd,
  Edit,
  Refresh,
  History,
} from '@mui/icons-material';
import type { AccionVendedor } from '@/data/mockData';
import { historialAPI } from '@/services/api';

interface VendedorFiltro {
  id: number;
  nombre: string;
}

const HistorialAcciones: React.FC = () => {
  const [acciones, setAcciones] = useState<AccionVendedor[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vendedorFiltro, setVendedorFiltro] = useState<number | 'TODOS'>('TODOS');
  const [tipoAccionFiltro, setTipoAccionFiltro] = useState<string>('TODOS');
  const [vendedores, setVendedores] = useState<VendedorFiltro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      setLoading(true);
      const data = await historialAPI.listar();
      const mapeadas: AccionVendedor[] = data.map((item) => {
        const fechaObj = new Date(item.fechaHora);
        const fecha = fechaObj.toISOString().slice(0, 10);
        const hora = fechaObj.toTimeString().slice(0, 8);
        const vendedorNombre = item.usuario
          ? `${item.usuario.firstname} ${item.usuario.lastname}`.trim() || item.usuario.username
          : 'Desconocido';
        return {
          id: item.id,
          fecha,
          hora,
          vendedorId: item.usuario?.id ?? 0,
          vendedorNombre,
          tipoAccion: item.tipoAccion as AccionVendedor['tipoAccion'],
          descripcion: item.descripcion,
          detalles: item.detalle,
        };
      });
      setAcciones(mapeadas);

      const vendedoresUnicos: Record<number, string> = {};
      mapeadas.forEach((a) => {
        if (a.vendedorId && !vendedoresUnicos[a.vendedorId]) {
          vendedoresUnicos[a.vendedorId] = a.vendedorNombre;
        }
      });
      setVendedores(
        Object.entries(vendedoresUnicos).map(([id, nombre]) => ({
          id: Number(id),
          nombre,
        })),
      );
      setLoading(false);
    };

    cargarHistorial();
  }, []);

  const accionesFiltradas = acciones.filter((accion) => {
    const matchFechaInicio = !fechaInicio || accion.fecha >= fechaInicio;
    const matchFechaFin = !fechaFin || accion.fecha <= fechaFin;
    const matchVendedor = vendedorFiltro === 'TODOS' || accion.vendedorId === vendedorFiltro;
    const matchTipoAccion = tipoAccionFiltro === 'TODOS' || accion.tipoAccion === tipoAccionFiltro;
    return matchFechaInicio && matchFechaFin && matchVendedor && matchTipoAccion;
  });

  const totalAcciones = accionesFiltradas.length;
  const totalVentas = accionesFiltradas.filter((a) => a.tipoAccion === 'VENTA').length;
  const totalClientesCreados = accionesFiltradas.filter((a) => a.tipoAccion === 'CREAR_CLIENTE').length;
  const totalClientesEditados = accionesFiltradas.filter((a) => a.tipoAccion === 'EDITAR_CLIENTE').length;

  const limpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    setVendedorFiltro('TODOS');
    setTipoAccionFiltro('TODOS');
  };

  const getAccionIcon = (tipo: string) => {
    switch (tipo) {
      case 'VENTA':
        return <ShoppingCart sx={{ fontSize: 18 }} />;
      case 'CREAR_CLIENTE':
        return <PersonAdd sx={{ fontSize: 18 }} />;
      case 'EDITAR_CLIENTE':
        return <Edit sx={{ fontSize: 18 }} />;
      default:
        return null;
    }
  };

  const getAccionColor = (tipo: string): 'success' | 'primary' | 'warning' | 'default' => {
    switch (tipo) {
      case 'VENTA':
        return 'success';
      case 'CREAR_CLIENTE':
        return 'primary';
      case 'EDITAR_CLIENTE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAccionLabel = (tipo: string) => {
    switch (tipo) {
      case 'VENTA':
        return 'Venta';
      case 'CREAR_CLIENTE':
        return 'Cliente Creado';
      case 'EDITAR_CLIENTE':
        return 'Cliente Editado';
      default:
        return tipo;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Historial de Acciones
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Registro de actividades realizadas por los vendedores
      </Typography>

      {loading ? (
        <Card>
          <CardContent sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Cargando historial de acciones...
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <History sx={{ fontSize: 32, opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalAcciones}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total Acciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ShoppingCart sx={{ fontSize: 32, opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalVentas}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Ventas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <PersonAdd sx={{ fontSize: 32, opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalClientesCreados}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Clientes Creados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Edit sx={{ fontSize: 32, opacity: 0.8, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {totalClientesEditados}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Clientes Editados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterList sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtros
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Vendedor</InputLabel>
                <Select
                  value={vendedorFiltro}
                  label="Vendedor"
                  onChange={(e) => setVendedorFiltro(e.target.value as number | 'TODOS')}
                >
                  <MenuItem value="TODOS">Todos los vendedores</MenuItem>
                  {vendedores.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Acción</InputLabel>
                <Select
                  value={tipoAccionFiltro}
                  label="Tipo de Acción"
                  onChange={(e) => setTipoAccionFiltro(e.target.value)}
                >
                  <MenuItem value="TODOS">Todas las acciones</MenuItem>
                  <MenuItem value="VENTA">Ventas</MenuItem>
                  <MenuItem value="CREAR_CLIENTE">Crear Cliente</MenuItem>
                  <MenuItem value="EDITAR_CLIENTE">Editar Cliente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Refresh />}
                onClick={limpiarFiltros}
                sx={{ py: 1.5 }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de Historial */}
      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>FECHA / HORA</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>VENDEDOR</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>TIPO DE ACCIÓN</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>DESCRIPCIÓN</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>DETALLES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accionesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron acciones con los filtros seleccionados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                accionesFiltradas.map((accion) => (
                  <TableRow
                    key={accion.id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(30, 58, 95, 0.04)' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {new Date(accion.fecha).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {accion.hora}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {accion.vendedorNombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getAccionIcon(accion.tipoAccion)}
                        label={getAccionLabel(accion.tipoAccion)}
                        size="small"
                        color={getAccionColor(accion.tipoAccion)}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{accion.descripcion}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300 }}>
                        {accion.detalles}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Mostrando {accionesFiltradas.length} de {acciones.length} acciones
          </Typography>
        </Box>
      </Card>
        </>
      )}
    </Box>
  );
};

export default HistorialAcciones;
