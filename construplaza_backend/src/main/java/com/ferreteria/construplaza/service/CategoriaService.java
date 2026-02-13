package com.ferreteria.construplaza.service;

import com.ferreteria.construplaza.entity.*;
import com.ferreteria.construplaza.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final HistorialAccionService historialAccionService;


    // 📋 Listar todas (NO lleva historial)
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // ➕ Crear categoría
    public Categoria crear(Categoria categoria, User usuario) {

        Optional<Categoria> existente =
                categoriaRepository.findByNombre(categoria.getNombre());

        if (existente.isPresent()) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }

        Categoria guardada = categoriaRepository.save(categoria);

        historialAccionService.registrar(
                usuario,
                TipoAccion.CREAR,
                TipoEntidad.CATEGORIA,
                "Categoría creada ID: " + guardada.getIdCategoria(),
                guardada
        );

        return guardada;
    }

    // ✏️ Actualizar categoría
    public Categoria actualizar(Integer id, Categoria categoria, User usuario) {

        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Categoría no encontrada con ID: " + id)
                );

        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());

        Categoria actualizada = categoriaRepository.save(existente);

        historialAccionService.registrar(
                usuario,
                TipoAccion.EDITAR,
                TipoEntidad.CATEGORIA,
                "Categoría editada ID: " + actualizada.getIdCategoria(),
                actualizada
        );

        return actualizada;
    }

    // ❌ Eliminar categoría
    public void eliminar(Integer id, User usuario) {

        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Categoría no encontrada con ID: " + id)
                );

        categoriaRepository.delete(existente);

        historialAccionService.registrar(
                usuario,
                TipoAccion.ELIMINAR,
                TipoEntidad.CATEGORIA,
                "Categoría eliminada ID: " + id,
                existente
        );
    }
}
