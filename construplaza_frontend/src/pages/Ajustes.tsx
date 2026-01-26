import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  Divider,
  Button,
  TextField,
  FormControlLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Store,
  Receipt,
  Notifications,
  Security,
  Palette,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const Ajustes: React.FC = () => {
  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: '¡Configuración guardada!',
      text: 'Los cambios han sido aplicados correctamente.',
      confirmButtonColor: '#1e3a5f',
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        Ajustes del Sistema
      </Typography>
      <Typography  variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Configuración general del sistema Construplaza
      </Typography>

      <Grid container spacing={3}>
        {/* Datos de la Empresa */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Store sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Datos de la Empresa
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre Comercial"
                    defaultValue="Ferretería Construplaza"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="RUC" defaultValue="20123456789" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    defaultValue="Av. La Marina 2500, San Miguel, Lima"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Teléfono" defaultValue="01-452-7890" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Email" defaultValue="ventas@construplaza.pe" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Facturación */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Receipt sx={{ color: 'secondary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Facturación
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Habilitar facturación electrónica"
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="IGV (%)"
                    type="number"
                    defaultValue="18"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Serie Boleta"
                    defaultValue="B001"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Imprimir automáticamente al emitir"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Notifications sx={{ color: 'warning.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notificaciones
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Alerta de stock bajo (menos de 10 unidades)"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notificar ventas diarias por email"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Alertas de nuevos pedidos"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Recordatorio de cierre de caja"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Seguridad */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Security sx={{ color: 'error.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Seguridad
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Cierre de sesión automático (30 min inactivo)"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Requerir contraseña para anular ventas"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Autenticación de dos factores"
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" color="primary" fullWidth>
                Cambiar contraseña de administrador
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Apariencia */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Palette sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Apariencia
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      p: 2,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        height: 60,
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                      Azul Marino (Actual)
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 2, border: '1px solid #e0e0e0', cursor: 'pointer' }}>
                    <Box
                      sx={{
                        height: 60,
                        background: 'linear-gradient(135deg, #1e4620 0%, #2e7d32 100%)',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                      Verde Bosque
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 2, border: '1px solid #e0e0e0', cursor: 'pointer' }}>
                    <Box
                      sx={{
                        height: 60,
                        background: 'linear-gradient(135deg, #4a1c1c 0%, #8b3232 100%)',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                      Rojo Industrial
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón Guardar */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SettingsIcon />}
          onClick={handleSave}
          sx={{ px: 4 }}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};

export default Ajustes;
