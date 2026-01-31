package com.ferreteria.construplaza.controller;

import com.ferreteria.construplaza.controller.DTO.VentaRequest;
import com.ferreteria.construplaza.controller.DTO.VentaResponse;
import com.ferreteria.construplaza.entity.Cliente;
import com.ferreteria.construplaza.entity.Producto;
import com.ferreteria.construplaza.entity.User;
import com.ferreteria.construplaza.entity.Venta;
import com.ferreteria.construplaza.repository.ClienteRepository;
import com.ferreteria.construplaza.repository.ProductoRepository;
import com.ferreteria.construplaza.repository.UserRepository;
import com.ferreteria.construplaza.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/construplaza/vendedor")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
public class VendedorController {

    private final ProductoRepository productoRepository;
    private final VentaService ventaService;
    private final ClienteRepository clienteRepository;
    private final UserRepository userRepository;

    // 🔎 Ver productos disponibles
    @GetMapping("/productos")
    public ResponseEntity<?> listarProductos() {

        List<Producto> productos = productoRepository.findByEstadoTrue();

        if (productos.isEmpty()) {
            return ResponseEntity.ok("No hay productos disponibles");
        }

        return ResponseEntity.ok(productos);
    }

    // 👤 Registrar cliente (opcional)
    @PostMapping("/cliente")
    public Cliente registrarCliente(@RequestBody Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // 🧾 Crear venta
    @PostMapping("/venta")
    public ResponseEntity<VentaResponse> registrarVenta(@RequestBody VentaRequest request) {
        User vendedor = obtenerUsuarioAutenticado();
        VentaResponse response = ventaService.registrarVenta(request, vendedor);
        return ResponseEntity.ok(response);
    }


    // 📊 Ver MIS ventas
    @GetMapping("/mis-ventas")
    public List<Venta> misVentas() {

        User vendedor = obtenerUsuarioAutenticado();
        return ventaService.ventasPorVendedor(vendedor.getId());
    }

    // 🔐 MÉTODO CENTRALIZADO
    private User obtenerUsuarioAutenticado() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // viene del JWT

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }
}
