package com.ferreteria.construplaza.controller;


import com.ferreteria.construplaza.controller.DTO.ProductoDTO;
import com.ferreteria.construplaza.entity.Producto;
import com.ferreteria.construplaza.entity.User;
import com.ferreteria.construplaza.repository.UserRepository;
import com.ferreteria.construplaza.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final UserRepository userRepository;


    public ProductoController(ProductoService productoService, UserRepository userRepository) {
        this.productoService = productoService;
        this.userRepository = userRepository;
    }
    private User obtenerUsuarioAutenticado() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Buscar por SKU
    @GetMapping("/sku/{sku}")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    public Producto buscarPorSku(@PathVariable String sku) {
        return productoService.buscarPorSku(sku);
    }

    // Buscar por marca
    @GetMapping("/marca")
    @PreAuthorize("hasAnyRole('ADMIN','VENDEDOR')")
    public List<Producto> buscarPorMarca(@RequestParam String marca) {
        return productoService.buscarPorMarca(marca);
    }

    // Buscar por categoría
    @GetMapping("/categoria")
    @PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
    public List<Producto> buscarPorCategoria(@RequestParam String categoria) {
        return productoService.buscarPorCategoria(categoria);
    }


    // Listar todos los productos activos (DTO para frontend)
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
    public ResponseEntity<List<ProductoDTO>> listarActivos() {
        List<Producto> productos = productoService.listarActivos();
        List<ProductoDTO> dtos = productos.stream().map(p -> ProductoDTO.builder()
                .id(p.getIdProducto())
                .nombre(p.getNombre())
                .sku(p.getSku())
                .marca(p.getMarca())
                .categoria(p.getCategoria() != null ? p.getCategoria().getNombre() : null)
                .precio(p.getPrecioVenta() != null ? p.getPrecioVenta().doubleValue() : null)
                .stock(p.getStockActual() != null ? p.getStockActual().intValue() : null)
                .imagen(p.getImagenUrl())
                .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
    public Producto obtener(@PathVariable Integer id) {
        return productoService.buscarPorId(id);
    }

    // Crear producto (solo ADMIN)
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Producto crear(@RequestBody Producto producto) {
        User usuario = obtenerUsuarioAutenticado();
        return productoService.crear(producto,usuario);
    }

    // Actualizar producto (solo ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Producto actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
        User usuario = obtenerUsuarioAutenticado();
        return productoService.actualizar(id, producto,usuario);
    }

    // Eliminar producto (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        User usuario = obtenerUsuarioAutenticado();
        productoService.eliminar(id,usuario);
    }

    // Buscar productos por nombre
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
    public List<Producto> buscar(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

    // Productos con stock bajo
    @GetMapping("/stock-bajo")
    @PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
    public List<Producto> stockBajo() {
        return productoService.alertaStock();
    }
}