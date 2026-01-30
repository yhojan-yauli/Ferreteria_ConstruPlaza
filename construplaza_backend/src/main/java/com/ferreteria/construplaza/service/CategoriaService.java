package com.ferreteria.construplaza.service;

import com.ferreteria.construplaza.entity.Categoria;
import com.ferreteria.construplaza.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Listar todas las categorías
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // Crear una nueva categoría
    public Categoria crear(Categoria categoria) {
        // Validar que no exista otra categoría con el mismo nombre
        Optional<Categoria> existente = categoriaRepository.findByNombre(categoria.getNombre());
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }
        return categoriaRepository.save(categoria);
    }

    // Actualizar una categoría existente
    public Categoria actualizar(Integer id, Categoria categoria) {
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        // Actualizar campos
        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());

        return categoriaRepository.save(existente);
    }

    // Eliminar una categoría por ID
    public void eliminar(Integer id) {
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        categoriaRepository.delete(existente);
    }
}