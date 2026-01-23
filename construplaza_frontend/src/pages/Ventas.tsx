import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button,
  Divider,
  Badge,
} from '@mui/material';
import {
  Search,
  Add,
  Remove,
  ShoppingCart,
  Delete,
  Receipt,
} from '@mui/icons-material';
import { productos, categorias, Producto } from '@/data/mockData';
import Swal from 'sweetalert2';

interface CartItem extends Producto {
  cantidad: number;
}

const Ventas: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [ordenNumero] = useState(Math.floor(1000 + Math.random() * 9000));

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
    return matchBusqueda && matchCategoria;
  });

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (id: number, delta: number) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCantidad = item.cantidad + delta;
            if (nuevaCantidad <= 0) return null;
            return { ...item, cantidad: Math.min(nuevaCantidad, item.stock) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const emitirBoleta = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agregue productos antes de emitir la boleta',
        confirmButtonColor: '#1e3a5f',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: '¡Venta realizada!',
      html: `
        <p>Boleta N° <strong>B001-${ordenNumero}</strong></p>
        <p>Total: <strong>S/ ${total.toFixed(2)}</strong></p>
      `,
      confirmButtonColor: '#2e7d32',
      confirmButtonText: 'Aceptar',
    });
    setCarrito([]);
  };

  const getStockColor = (stock: number) => {
    if (stock < 10) return 'error';
    if (stock < 50) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Punto de Venta
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Gestiona las ventas de manera rápida y eficiente
      </Typography>

      <Grid container spacing={3}>
        {/* Catálogo - Izquierda */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2 }}>
            {/* Buscador */}
            <TextField
              fullWidth
              placeholder="Buscar productos (SKU, nombre, categoría)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filtros de Categoría */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {categorias.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  variant={categoriaActiva === cat ? 'filled' : 'outlined'}
                  color={categoriaActiva === cat ? 'primary' : 'default'}
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>

            {/* Grid de Productos */}
            <Grid container spacing={2}>
              {productosFiltrados.map((producto) => (
                <Grid item xs={6} sm={4} md={3} key={producto.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(30, 58, 95, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 100,
                          bgcolor: '#f5f7fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShoppingCart sx={{ fontSize: 40, color: '#ccc' }} />
                      </CardMedia>
                      <Chip
                        label={`${producto.stock} Stock`}
                        size="small"
                        color={getStockColor(producto.stock)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flex: 1, p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          fontSize: '0.8rem',
                          lineHeight: 1.3,
                          minHeight: 32,
                        }}
                      >
                        {producto.nombre}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: 'primary.main', fontWeight: 700 }}
                      >
                        S/ {producto.precio.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 1.5, pt: 0 }}>
                      <IconButton
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          width: '100%',
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'primary.dark' },
                          '&:disabled': { bgcolor: '#ccc' },
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Ticket - Derecha */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Orden #{ordenNumero}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date().toLocaleDateString('es-PE', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
                <Badge badgeContent={carrito.length} color="secondary">
                  <Receipt sx={{ color: 'primary.main' }} />
                </Badge>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Items del carrito */}
              <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                {carrito.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}
                  >
                    No hay productos en el carrito
                  </Typography>
                ) : (
                  carrito.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
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
                        <ShoppingCart sx={{ color: '#ccc', fontSize: 24 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          {item.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          S/ {item.precio.toFixed(2)} × {item.cantidad}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => actualizarCantidad(item.id, -1)}
                          sx={{ bgcolor: '#f5f7fa' }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                          {item.cantidad}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => actualizarCantidad(item.id, 1)}
                          sx={{ bgcolor: '#f5f7fa' }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 60, textAlign: 'right' }}>
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => eliminarDelCarrito(item.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Resumen financiero */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body2">S/ {subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    IGV (18%)
                  </Typography>
                  <Typography variant="body2">S/ {igv.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    S/ {total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Botón Emitir Boleta */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Receipt />}
                onClick={emitirBoleta}
                sx={{
                  py: 1.5,
                  bgcolor: '#2e7d32',
                  '&:hover': { bgcolor: '#1b5e20' },
                }}
              >
                PAGAR / EMITIR BOLETA
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Ventas;
