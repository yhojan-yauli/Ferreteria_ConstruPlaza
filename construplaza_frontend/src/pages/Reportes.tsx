import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Receipt,
  AttachMoney,
  Warning,
  FilterList,
  Download,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { productoAPI, ventasAPI, Producto, VentaResumen } from '@/services/api';

interface VentaPorDia {
  dia: string;
  ventas: number;
}

interface VentasPorMetodoPago {
  name: string;
  value: number;
}

interface TopVendedor {
  ranking: number;
  vendedor: string;
  cantidad: number;
  ingresos: number;
}

const Reportes: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ventas, setVentas] = useState<VentaResumen[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const [ventasResp, productosResp] = await Promise.all([
        ventasAPI.misVentas(),
        productoAPI.listarProductos(),
      ]);
      setVentas(ventasResp);
      setProductos(productosResp);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const enRango = (fechaIso: string): boolean => {
    if (!fechaIso) return false;
    const soloFecha = fechaIso.slice(0, 10);
    if (fechaInicio && soloFecha < fechaInicio) return false;
    if (fechaFin && soloFecha > fechaFin) return false;
    return true;
  };

  const ventasFiltradas = ventas.filter((v) => enRango(v.fechaEmision));

  const ventasDelMes = ventasFiltradas.reduce(
    (sum, v) => sum + (v.total ?? 0),
    0,
  );
  const ticketsEmitidos = ventasFiltradas.length;
  const gananciaNeta = ventasFiltradas.reduce(
    (sum, v) => sum + (v.totalGravado ?? 0),
    0,
  );
  const productosCriticos = productos.filter((p) => (p.stock ?? 0) < 10).length;

  const COLORS = ['#1e3a5f', '#2563eb', '#60a5fa', '#93c5fd', '#dbeafe'];

  const ventasPorDia: VentaPorDia[] = (() => {
    const mapa: Record<string, number> = {};
    ventasFiltradas.forEach((v) => {
      const dia = v.fechaEmision.slice(0, 10);
      mapa[dia] = (mapa[dia] ?? 0) + (v.total ?? 0);
    });
    return Object.entries(mapa)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([dia, ventas]) => ({ dia, ventas }));
  })();

  const ventasPorMetodoPago: VentasPorMetodoPago[] = (() => {
    const mapa: Record<string, number> = {};
    ventasFiltradas.forEach((v) => {
      const metodo = v.metodoPago || 'DESCONOCIDO';
      mapa[metodo] = (mapa[metodo] ?? 0) + (v.total ?? 0);
    });
    return Object.entries(mapa).map(([name, value]) => ({ name, value }));
  })();

  const topVendedores: TopVendedor[] = (() => {
    const mapa: Record<
      number,
      { nombre: string; cantidad: number; ingresos: number }
    > = {};
    ventasFiltradas.forEach((v) => {
      const id = v.vendedor?.id;
      if (!id) return;
      const nombre = `${v.vendedor.firstname} ${v.vendedor.lastname}`.trim()
        || v.vendedor.username;
      if (!mapa[id]) {
        mapa[id] = { nombre, cantidad: 0, ingresos: 0 };
      }
      mapa[id].cantidad += 1;
      mapa[id].ingresos += v.total ?? 0;
    });
    return Object.values(mapa)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5)
      .map((v, index) => ({
        ranking: index + 1,
        vendedor: v.nombre,
        cantidad: v.cantidad,
        ingresos: v.ingresos,
      }));
  })();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Reportes de Ventas
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Resumen general de rendimiento y métricas clave
      </Typography>

      {/* Filtros de fecha */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<FilterList />}
              sx={{ py: 1.5 }}
            >
              Filtrar
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Download />}
              sx={{ py: 1.5 }}
            >
              Exportar PDF
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Card sx={{ mb: 3, p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Cargando reportes de ventas...
          </Typography>
        </Card>
      ) : (
        <>
      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney sx={{ color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Ventas del Mes
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                S/ {ventasDelMes.toLocaleString()}
              </Typography>
              <Chip
                label="+0.2% vs mes anterior"
                size="small"
                color="success"
                sx={{ mt: 1, fontSize: '0.7rem' }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Receipt sx={{ color: 'secondary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Tickets Emitidos
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {ticketsEmitidos}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                12 devoluciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp sx={{ color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Ganancia Neta
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                S/ {gananciaNeta.toLocaleString()}
              </Typography>
              <Chip
                label="+12% margen saludable"
                size="small"
                color="success"
                sx={{ mt: 1, fontSize: '0.7rem' }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: '#fff5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Warning sx={{ color: 'error.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Productos Críticos
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {productosCriticos}
              </Typography>
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                Stock bajo - requiere atención
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Gráfico de Líneas - Ventas */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#1e3a5f', borderRadius: '50%' }} />
                  <Typography variant="body2">Ventas por día</Typography>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="dia" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => [`S/ ${value.toLocaleString()}`, '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ventas"
                    stroke="#1e3a5f"
                    strokeWidth={3}
                    dot={{ fill: '#1e3a5f', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Pastel - Categorías */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ventas por método de pago
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ventasPorMetodoPago}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {ventasPorMetodoPago.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: '#64748b', fontSize: 12 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla Top Vendedores */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Top 5 Vendedores por Ventas
            </Typography>
            <Button size="small" sx={{ color: 'primary.main' }}>
              Ver todo
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 700 }}>RANKING</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>VENDEDOR</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    VENTAS REALIZADAS
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    INGRESOS TOTALES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topVendedores.map((item) => (
                  <TableRow key={item.ranking}>
                    <TableCell>
                      <Chip
                        label={item.ranking}
                        size="small"
                        sx={{
                          bgcolor: item.ranking === 1 ? '#f57c00' : '#f5f7fa',
                          color: item.ranking === 1 ? 'white' : 'text.primary',
                          fontWeight: 700,
                          width: 32,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.vendedor}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{item.cantidad.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        S/ {item.ingresos.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
        </>
      )}
    </Box>
  );
};

export default Reportes;
