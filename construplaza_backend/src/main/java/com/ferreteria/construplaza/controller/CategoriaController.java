package com.ferreteria.construplaza.controller;

import com.ferreteria.construplaza.entity.Categoria;
import com.ferreteria.construplaza.entity.User;
import com.ferreteria.construplaza.repository.UserRepository;
import com.ferreteria.construplaza.service.CategoriaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final UserRepository userRepository;


    private User obtenerUsuarioAutenticado() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }


    public CategoriaController(CategoriaService categoriaService, UserRepository userRepository) {
        this.categoriaService = categoriaService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
    public List<Categoria> listar() {
        return categoriaService.listarTodas();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Categoria crear(@RequestBody Categoria categoria) {
        User usuario = obtenerUsuarioAutenticado();
        return categoriaService.crear(categoria, usuario);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Categoria actualizar(@PathVariable Integer id, @RequestBody Categoria categoria) {
        User usuario = obtenerUsuarioAutenticado();
        return categoriaService.actualizar(id, categoria,usuario);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        User usuario = obtenerUsuarioAutenticado();
        categoriaService.eliminar(id, usuario);
    }
}
