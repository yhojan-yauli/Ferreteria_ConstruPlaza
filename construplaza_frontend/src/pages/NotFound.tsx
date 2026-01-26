import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home } from "@mui/icons-material";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "4rem" },
              fontWeight: 700,
              mb: 2,
              color: "primary.main",
            }}
          >
            404
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            Oops! Página no encontrada
          </Typography>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{
              mt: 2,
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
