package com.ferreteria.construplaza.service;

import com.ferreteria.construplaza.entity.Categoria;
import com.ferreteria.construplaza.entity.Producto;
import com.ferreteria.construplaza.repository.CategoriaRepository;
import com.ferreteria.construplaza.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service

public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    // Buscar por SKU
    public Producto buscarPorSku(String sku) {
        return productoRepository.findBySkuAndEstadoTrue(sku);
    }

    // Buscar por marca
    public List<Producto> buscarPorMarca(String marca) {
        return productoRepository.findByMarcaContainingIgnoreCaseAndEstadoTrue(marca);
    }

    // Buscar por categoría
    public List<Producto> buscarPorCategoria(String categoriaNombre) {
        return productoRepository.findByCategoriaNombreIgnoreCaseAndEstadoTrue(categoriaNombre);
    }
    //________________
     //_______________

    // Listar todos los productos activos
    public List<Producto> listarActivos() {
        return productoRepository.findByEstadoTrue();
    }

    // Buscar producto por ID
    public Producto buscarPorId(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // Crear producto
    public Producto crear(Producto producto) {

        if (producto.getCategoria() != null && producto.getCategoria().getIdCategoria() != null) {
            Categoria cat = categoriaRepository.findById(producto.getCategoria().getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(cat);
        }
        return productoRepository.save(producto);
    }

    // Actualizar producto
    public Producto actualizar(Integer id, Producto producto) {
        Producto p = buscarPorId(id);
        p.setNombre(producto.getNombre());
        p.setSku(producto.getSku());
        p.setMarca(producto.getMarca());
        p.setDescripcion(producto.getDescripcion());
        p.setPrecioCompra(producto.getPrecioCompra());
        p.setPrecioVenta(producto.getPrecioVenta());
        p.setStockActual(producto.getStockActual());
        p.setStockMinimo(producto.getStockMinimo());
        p.setUnidadMedida(producto.getUnidadMedida());
        p.setCategoria(producto.getCategoria());
        p.setImagenUrl(producto.getImagenUrl());
        p.setEstado(producto.getEstado());
        return productoRepository.save(p);
    }

    // Eliminar producto (solo cambia estado)
    public void eliminar(Integer id) {
        Producto p = buscarPorId(id);
        p.setEstado(false);
        productoRepository.save(p);
    }

    // Buscar por nombre
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndEstadoTrue(nombre);
    }

    // Productos con stock bajo
    public List<Producto> alertaStock() {
        return productoRepository.findByStockActualLessThanEqualAndEstadoTrue(BigDecimal.valueOf(10)); // ejemplo: stockMinimo 10
    }
}