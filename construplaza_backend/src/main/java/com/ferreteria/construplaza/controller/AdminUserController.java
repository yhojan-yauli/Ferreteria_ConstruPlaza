package com.ferreteria.construplaza.controller;


import com.ferreteria.construplaza.controller.DTO.HistorialResponse;
import com.ferreteria.construplaza.entity.*;

import com.ferreteria.construplaza.repository.HistorialAccionRepository;
import com.ferreteria.construplaza.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/usuarios")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HistorialAccionRepository historialRepository;

    @GetMapping("/historial")
    public List<HistorialAccion> filtrar(
            @RequestParam(required = false) TipoAccion tipoAccion,
            @RequestParam(required = false) TipoEntidad tipoEntidad,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {

        LocalDateTime inicio = fechaInicio != null ? LocalDateTime.parse(fechaInicio) : null;
        LocalDateTime fin = fechaFin != null ? LocalDateTime.parse(fechaFin) : null;

        if (tipoAccion != null && inicio != null && fin != null) {
            return historialRepository.findByTipoAccionAndFechaHoraBetween(tipoAccion, inicio, fin);
        }

        if (inicio != null && fin != null) {
            return historialRepository.findByFechaHoraBetween(inicio, fin);
        }

        if (tipoAccion != null) {
            return historialRepository.findByTipoAccion(tipoAccion);
        }

        if (tipoEntidad != null) {
            return historialRepository.findByTipoEntidad(tipoEntidad);
        }

        if (usuario != null) {
            return historialRepository.findByUsuarioUsername(usuario);
        }

        return historialRepository.findAll();
    }


    // Crear VENDEDOR o almacenero
    @PostMapping("/crear")
    public String crearVendedor(@RequestBody CrearUsuarioRequest request) {

        // Evitar duplicados
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        User user;
        user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .role(request.getRole())
                .build();

        userRepository.save(user);

        return "usuario creado correctamente";
    }

    // Listar usuarios (solo admin)
    @GetMapping("/lista")
    public List<User> listarUsuarios() {
        return userRepository.findAll();
    }
}
