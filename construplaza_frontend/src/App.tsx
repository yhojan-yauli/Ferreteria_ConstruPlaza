import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/muiTheme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Ventas from "./pages/Ventas";
import Inventario from "./pages/Inventario";
import Reportes from "./pages/Reportes";
import Ajustes from "./pages/Ajustes";
import GestionUsuarios from "./pages/GestionUsuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas con layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/ventas" replace />} />
                <Route path="ventas" element={<Ventas />} />
                <Route path="inventario" element={<Inventario />} />
                <Route
                  path="reportes"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Reportes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="ajustes"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Ajustes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="usuarios"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <GestionUsuarios />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
