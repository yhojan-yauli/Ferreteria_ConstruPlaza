package com.ferreteria.construplaza.controller;


import com.ferreteria.construplaza.entity.Role;
import com.ferreteria.construplaza.entity.User;

import com.ferreteria.construplaza.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/usuarios")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Crear VENDEDOR o almacenero
    @PostMapping("/crear")
    public String crearVendedor(@RequestBody CrearUsuarioRequest request) {

        User user;
        user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .role(Role.VENDEDOR)
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
