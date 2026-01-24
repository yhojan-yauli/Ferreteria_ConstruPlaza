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
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Inventory as InventoryIcon,
  AttachMoney,
  Warning,
} from '@mui/icons-material';
import { productos, categorias, Producto } from '@/data/mockData';
import Swal from 'sweetalert2';

const Inventario: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [productosState, setProductosState] = useState(productos);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  const productosFiltrados = productosState.filter((p) => {
    const matchBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  });

  const totalProductos = productosState.length;
  const valorInventario = productosState.reduce((sum, p) => sum + p.precio * p.stock, 0);
  const productosCriticos = productosState.filter((p) => p.stock < 10).length;

  const getStockChip = (stock: number) => {
    if (stock === 0) {
      return <Chip label="0 STOCK" size="small" sx={{ bgcolor: '#e0e0e0', color: '#666', fontWeight: 600 }} />;
    }
    if (stock < 10) {
      return <Chip label={`${stock} CRÍTICO`} size="small" color="error" sx={{ fontWeight: 600 }} />;
    }
    if (stock < 50) {
      return <Chip label={`${stock} BAJO`} size="small" color="warning" sx={{ fontWeight: 600 }} />;
    }
    return <Chip label={`${stock} NORMAL`} size="small" color="success" sx={{ fontWeight: 600 }} />;
  };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setProductosState((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#1e3a5f',
        });
      }
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Inventario
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Control y gestión del stock de productos
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
              <InventoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total de Productos
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalProductos.toLocaleString()}
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
              <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Valor del Inventario
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  S/ {valorInventario.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Alertas de Stock
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {productosCriticos} Items
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Requieren atención inmediata
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
                placeholder="Buscar por nombre, SKU o marca..."
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
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={categoriaFiltro}
                  label="Categoría"
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === 'Todos' ? 'Todas las categorías' : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  py: 1.5,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                + NUEVO INGRESO
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de Productos */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>ID / SKU</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>PRODUCTO</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  PRECIO UNIT.
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  STOCK ACTUAL
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  ESTADO
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  ACCIONES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.map((producto) => (
                <TableRow
                  key={producto.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(30, 58, 95, 0.04)' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {producto.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: '#f5f7fa',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InventoryIcon sx={{ color: '#ccc' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {producto.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {producto.marca}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      S/ {producto.precio.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{getStockChip(producto.stock)}</TableCell>
                  <TableCell align="center">
                    <Switch defaultChecked={producto.stock > 0} color="primary" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(producto)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(producto.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Mostrando 1 a {productosFiltrados.length} de {totalProductos} resultados
          </Typography>
        </Box>
      </Card>

      {/* Dialog para Editar/Agregar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                defaultValue={editingProduct?.nombre || ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="SKU"
                defaultValue={editingProduct?.sku || ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Marca"
                defaultValue={editingProduct?.marca || ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                defaultValue={editingProduct?.precio || ''}
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                defaultValue={editingProduct?.stock || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  label="Categoría"
                  defaultValue={editingProduct?.categoria || ''}
                >
                  {categorias.filter((c) => c !== 'Todos').map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleCloseDialog();
              Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'Los cambios han sido guardados correctamente.',
                confirmButtonColor: '#1e3a5f',
              });
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventario;
