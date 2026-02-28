import React, { useState, useEffect } from 'react';
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
import { Producto, productoAPI, categoriaAPI, type CategoriaBackend, type ProductoPayload } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';

const Inventario: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [productosState, setProductosState] = useState<Producto[]>([]);
  const [categoriasList, setCategoriasList] = useState<CategoriaBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formMarca, setFormMarca] = useState('');
  const [formPrecio, setFormPrecio] = useState<string>('');
  const [formStock, setFormStock] = useState<string>('');
  const [formCategoriaId, setFormCategoriaId] = useState<number>(0);
  const [formImagenUrl, setFormImagenUrl] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const [datosReales, categorias] = await Promise.all([
        productoAPI.listarProductos(),
        categoriaAPI.listar(),
      ]);
      setProductosState(datosReales);
      setCategoriasList(categorias);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const productosFiltrados = productosState.filter((p) => {
    const matchBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.sku ?? '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.marca ?? '').toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || (p.categoria ?? '') === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  });

  const totalProductos = productosState.length;
  const valorInventario = productosState.reduce(
    (sum, p) => sum + (p.precio ?? 0) * (p.stock ?? 0),
    0
  );
  const productosCriticos = productosState.filter((p) => (p.stock ?? 0) < 10).length;

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
    setFormNombre(producto.nombre ?? '');
    setFormSku(producto.sku ?? '');
    setFormMarca(producto.marca ?? '');
    setFormPrecio(String(producto.precio ?? ''));
    setFormStock(String(producto.stock ?? ''));
    setFormImagenUrl(producto.imagen ?? '');
    const catId = categoriasList.find((c) => c.nombre === (producto.categoria ?? ''))?.idCategoria ?? 0;
    setFormCategoriaId(catId);
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
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await productoAPI.eliminar(id);
        const datosReales = await productoAPI.listarProductos();
        setProductosState(datosReales);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#1e3a5f',
        });
      } catch (err: unknown) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: err instanceof Error ? err.message : 'No se puede eliminar porque tiene historial asociado.',
          confirmButtonColor: '#1e3a5f',
        });
      }
    });
  };

  const handleOpenNuevo = () => {
    setEditingProduct(null);
    setFormNombre('');
    setFormSku('');
    setFormMarca('');
    setFormPrecio('');
    setFormStock('');
    setFormCategoriaId(categoriasList[0]?.idCategoria ?? 0);
    setFormImagenUrl('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleGuardarProducto = async () => {
    const precioNum = parseFloat(formPrecio);
    const stockNum = parseInt(formStock, 10);
    if (!formNombre.trim()) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Ingrese el nombre del producto.', confirmButtonColor: '#1e3a5f' });
      return;
    }
    if (isNaN(precioNum) || precioNum < 0) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Precio inválido.', confirmButtonColor: '#1e3a5f' });
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Stock inválido.', confirmButtonColor: '#1e3a5f' });
      return;
    }
    const payload: ProductoPayload = {
      nombre: formNombre.trim(),
      sku: formSku.trim() || formNombre.trim().slice(0, 10).toUpperCase(),
      marca: formMarca.trim() || undefined,
      precioCompra: precioNum,
      precioVenta: precioNum,
      stockActual: stockNum,
      stockMinimo: Math.min(10, stockNum),
      unidadMedida: 'UND',
      imagenUrl: formImagenUrl.trim() || null,
      estado: true,
    };
    if (formCategoriaId > 0) payload.categoria = { idCategoria: formCategoriaId };

    setGuardando(true);
    try {
      if (editingProduct) {
        await productoAPI.actualizar(editingProduct.id, payload);
        Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'El producto ha sido actualizado.', confirmButtonColor: '#1e3a5f' });
      } else {
        await productoAPI.crear(payload);
        Swal.fire({ icon: 'success', title: '¡Creado!', text: 'El producto ha sido creado.', confirmButtonColor: '#1e3a5f' });
      }
      const datosReales = await productoAPI.listarProductos();
      setProductosState(datosReales);
      handleCloseDialog();
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'No se pudo guardar.',
        confirmButtonColor: '#1e3a5f',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Inventario
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Control y gestión del stock de productos
      </Typography>

      {loading ? (
        <Card>
          <CardContent sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Cargando productos desde el servidor...
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
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
                  <MenuItem value="Todos">Todas las categorías</MenuItem>
                  {categoriasList.map((c) => (
                    <MenuItem key={c.idCategoria} value={c.nombre}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {isAdmin && (
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  onClick={handleOpenNuevo}
                  sx={{
                    py: 1.5,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  + NUEVO INGRESO
                </Button>
              </Grid>
            )}
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
                  <TableCell>{producto.categoria ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      S/ {(producto.precio ?? 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{getStockChip(producto.stock)}</TableCell>
                  <TableCell align="center">
                    <Switch defaultChecked={producto.stock > 0} color="primary" />
                  </TableCell>
                  <TableCell align="center">
                    {isAdmin ? (
                      <>
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
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Solo lectura
                      </Typography>
                    )}
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
        </>
      )}

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
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Marca"
                value={formMarca}
                onChange={(e) => setFormMarca(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={formPrecio}
                onChange={(e) => setFormPrecio(e.target.value)}
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
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  label="Categoría"
                  value={formCategoriaId || ''}
                  onChange={(e) => setFormCategoriaId(Number(e.target.value))}
                >
                  {categoriasList.map((c) => (
                    <MenuItem key={c.idCategoria} value={c.idCategoria}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de imagen (opcional)"
                value={formImagenUrl}
                onChange={(e) => setFormImagenUrl(e.target.value)}
                placeholder="https://..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={guardando}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarProducto} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventario;
