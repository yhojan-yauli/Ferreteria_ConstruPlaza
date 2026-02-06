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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Search,
  Add,
  Remove,
  ShoppingCart,
  Delete,
  Receipt,
  PersonAdd,
  Close,
} from '@mui/icons-material';
import { productos, categorias, Producto } from '@/data/mockData';
import Swal from 'sweetalert2';

interface CartItem extends Producto {
  cantidad: number;
}

interface ClienteVenta {
  tipoDocumento: 'DNI' | 'RUC';
  numeroDocumento: string;
  nombres: string;
  razonSocial: string;
  direccion: string;
  anonimo: boolean;
}

const clienteInicial: ClienteVenta = {
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  nombres: '',
  razonSocial: '',
  direccion: '',
  anonimo: false,
};

const Ventas: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [ordenNumero] = useState(Math.floor(1000 + Math.random() * 9000));
  const [dialogCliente, setDialogCliente] = useState(false);
  const [clienteData, setClienteData] = useState<ClienteVenta>(clienteInicial);

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

  const abrirFormularioCliente = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agregue productos antes de emitir la boleta',
        confirmButtonColor: '#1e3a5f',
      });
      return;
    }
    setClienteData(clienteInicial);
    setDialogCliente(true);
  };

  const confirmarVenta = () => {
    if (!clienteData.anonimo) {
      if (!clienteData.numeroDocumento.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos incompletos',
          text: 'Ingrese el número de documento del cliente',
          confirmButtonColor: '#1e3a5f',
        });
        return;
      }
      if (clienteData.tipoDocumento === 'DNI' && !clienteData.nombres.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos incompletos',
          text: 'Ingrese los nombres del cliente',
          confirmButtonColor: '#1e3a5f',
        });
        return;
      }
      if (clienteData.tipoDocumento === 'RUC' && !clienteData.razonSocial.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos incompletos',
          text: 'Ingrese la razón social del cliente',
          confirmButtonColor: '#1e3a5f',
        });
        return;
      }
    }

    const itemsParaImprimir = [...carrito];
    const totalesParaImprimir = { subtotal, igv, total };
    const clienteParaImprimir = { ...clienteData };

    setDialogCliente(false);
    setCarrito([]);

    Swal.fire({
      icon: 'success',
      title: '¡Venta realizada!',
      html: `
        <p>Boleta N° <strong>B001-${ordenNumero}</strong></p>
        <p>Total: <strong>S/ ${totalesParaImprimir.total.toFixed(2)}</strong></p>
      `,
      confirmButtonText: 'Imprimir Boleta',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#2e7d32',
    }).then((result) => {
      if (result.isConfirmed) {
        imprimirBoleta(itemsParaImprimir, totalesParaImprimir, clienteParaImprimir);
      }
    });
  };

  const getStockColor = (stock: number) => {
    if (stock < 10) return 'error';
    if (stock < 50) return 'warning';
    return 'success';
  };

  const imprimirBoleta = (
    items: CartItem[],
    totales: { subtotal: number; igv: number; total: number },
    cliente: ClienteVenta
  ) => {
    const fecha = new Date().toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const hora = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const numeroComprobante = `B001-${ordenNumero}`;

    const ventanaImpresion = window.open('', '_blank');
    if (!ventanaImpresion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo abrir la ventana de impresión. Verifique que las ventanas emergentes estén permitidas.',
      });
      return;
    }

    const productosHTML = items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; text-align: left;">${item.cantidad} x ${item.nombre}</td>
          <td style="padding: 8px; text-align: right;">S/ ${(item.precio * item.cantidad).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    let clienteHTML = '';
    if (cliente.anonimo) {
      clienteHTML = '<p><strong>CLIENTE:</strong> ANÓNIMO</p>';
    } else if (cliente.tipoDocumento === 'RUC') {
      clienteHTML = `
        <p><strong>${cliente.tipoDocumento}:</strong> ${cliente.numeroDocumento}</p>
        <p><strong>RAZÓN SOCIAL:</strong> ${cliente.razonSocial}</p>
        ${cliente.direccion ? `<p><strong>DIRECCIÓN:</strong> ${cliente.direccion}</p>` : ''}
      `;
    } else {
      clienteHTML = `
        <p><strong>${cliente.tipoDocumento}:</strong> ${cliente.numeroDocumento}</p>
        <p><strong>CLIENTE:</strong> ${cliente.nombres}</p>
        ${cliente.direccion ? `<p><strong>DIRECCIÓN:</strong> ${cliente.direccion}</p>` : ''}
      `;
    }

    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>BOLETA ${numeroComprobante}</title>
        <style>
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 10px;
            padding: 10px;
            width: 70mm;
            color: #000;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .header h1 {
            font-size: 16px;
            margin: 0 0 5px 0;
            font-weight: bold;
          }
          .header p {
            font-size: 10px;
            margin: 2px 0;
          }
          .info-comprobante {
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .info-comprobante p {
            margin: 3px 0;
          }
          .info-cliente {
            margin-bottom: 15px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .info-cliente p {
            margin: 3px 0;
          }
          .titulo-comprobante {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th {
            text-align: left;
            padding: 5px;
            border-bottom: 1px solid #000;
            font-size: 10px;
          }
          td {
            padding: 5px;
          }
          .totales {
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          .totales .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .totales .total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            border-top: 2px dashed #000;
            padding-top: 10px;
            font-size: 10px;
          }
          .footer p {
            margin: 3px 0;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FERRETERÍA CONSTRUPLAZA</h1>
          <p>RUC: 20123456789</p>
          <p>Av. Los Constructores 123, Lima - Perú</p>
          <p>Tel: (01) 555-1234</p>
        </div>

        <div class="info-comprobante">
          <p><strong>FECHA:</strong> ${fecha}</p>
          <p><strong>HORA:</strong> ${hora}</p>
          <p><strong>BOLETA ELECTRÓNICA:</strong> ${numeroComprobante}</p>
        </div>

        <div class="info-cliente">
          ${clienteHTML}
        </div>

        <div class="titulo-comprobante">BOLETA DE VENTA</div>

        <table>
          <thead>
            <tr>
              <th>DESCRIPCIÓN</th>
              <th style="text-align: right;">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        <div class="totales">
          <div class="row">
            <span>Subtotal:</span>
            <span>S/ ${totales.subtotal.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>IGV (18%):</span>
            <span>S/ ${totales.igv.toFixed(2)}</span>
          </div>
          <div class="row total">
            <span>TOTAL:</span>
            <span>S/ ${totales.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>SON: ${convertirNumeroALetras(totales.total)} CON ${totales.total.toFixed(2).split('.')[1]}/100 SOLES</p>
          <p>================================</p>
          <p>Gracias por su compra</p>
          <p>Vendedor: ${localStorage.getItem('construplaza_user') ? JSON.parse(localStorage.getItem('construplaza_user') || '{}').firstname : 'Admin'}</p>
          <p>================================</p>
          <p>www.construplaza.com</p>
        </div>
      </body>
      </html>
    `);

    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
  };

  const convertirNumeroALetras = (numero: number): string => {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = [
      '',
      'DIEZ',
      'VEINTE',
      'TREINTA',
      'CUARENTA',
      'CINCUENTA',
      'SESENTA',
      'SETENTA',
      'OCHENTA',
      'NOVENTA',
    ];
    const centenas = [
      '',
      'CIENTO',
      'DOSCIENTOS',
      'TRESCIENTOS',
      'CUATROCIENTOS',
      'QUINIENTOS',
      'SEISCIENTOS',
      'SETECIENTOS',
      'OCHOCIENTOS',
      'NOVECIENTOS',
    ];

    if (numero === 0) return 'CERO';
    if (numero >= 1000) return numero.toString();

    const entero = Math.floor(numero);
    let resultado = '';

    if (entero >= 100) {
      resultado += (entero === 100 ? 'CIEN' : centenas[Math.floor(entero / 100)]) + ' ';
    }
    const resto = entero % 100;
    if (resto >= 10 && resto <= 19) {
      const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
      resultado += especiales[resto - 10];
    } else if (resto >= 20) {
      resultado += decenas[Math.floor(resto / 10)];
      if (resto % 10 > 0) {
        resultado += ' Y ' + unidades[resto % 10];
      }
    } else if (resto > 0) {
      resultado += unidades[resto];
    }

    return resultado.trim() || 'CERO';
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
                onClick={abrirFormularioCliente}
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

      {/* Dialog Formulario de Cliente */}
      <Dialog
        open={dialogCliente}
        onClose={() => setDialogCliente(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: '#1e3a5f',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            Datos del Cliente
          </Box>
          <IconButton onClick={() => setDialogCliente(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={clienteData.anonimo}
                  onChange={(e) =>
                    setClienteData({ ...clienteInicial, anonimo: e.target.checked })
                  }
                />
              }
              label="Cliente Anónimo"
              sx={{ mb: 2 }}
            />

            {!clienteData.anonimo && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo Documento</InputLabel>
                    <Select
                      value={clienteData.tipoDocumento}
                      label="Tipo Documento"
                      onChange={(e) =>
                        setClienteData({
                          ...clienteData,
                          tipoDocumento: e.target.value as 'DNI' | 'RUC',
                          nombres: '',
                          razonSocial: '',
                        })
                      }
                    >
                      <MenuItem value="DNI">DNI</MenuItem>
                      <MenuItem value="RUC">RUC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    required
                    label="Número de Documento"
                    value={clienteData.numeroDocumento}
                    onChange={(e) =>
                      setClienteData({ ...clienteData, numeroDocumento: e.target.value })
                    }
                    inputProps={{
                      maxLength: clienteData.tipoDocumento === 'DNI' ? 8 : 11,
                    }}
                    helperText={clienteData.tipoDocumento === 'DNI' ? '8 dígitos' : '11 dígitos'}
                  />
                </Grid>

                {clienteData.tipoDocumento === 'DNI' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Nombres y Apellidos"
                      value={clienteData.nombres}
                      onChange={(e) =>
                        setClienteData({ ...clienteData, nombres: e.target.value })
                      }
                    />
                  </Grid>
                )}

                {clienteData.tipoDocumento === 'RUC' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Razón Social"
                      value={clienteData.razonSocial}
                      onChange={(e) =>
                        setClienteData({ ...clienteData, razonSocial: e.target.value })
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección (opcional)"
                    value={clienteData.direccion}
                    onChange={(e) =>
                      setClienteData({ ...clienteData, direccion: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            )}

            {/* Resumen de la orden */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Resumen de la orden
            </Typography>
            <Box sx={{ bgcolor: '#f5f7fa', borderRadius: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Productos:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {carrito.reduce((sum, item) => sum + item.cantidad, 0)} unidades
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">S/ {subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">IGV (18%):</Typography>
                <Typography variant="body2">S/ {igv.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  S/ {total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDialogCliente(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={confirmarVenta}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' },
            }}
          >
            Emitir Boleta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ventas;
