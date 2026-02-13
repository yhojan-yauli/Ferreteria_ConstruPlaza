package com.ferreteria.construplaza.service;

import com.ferreteria.construplaza.entity.*;
import com.ferreteria.construplaza.repository.CategoriaRepository;
import com.ferreteria.construplaza.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final HistorialAccionService historialAccionService;

    // ===============================
    // 🔎 MÉTODOS DE CONSULTA (SIN HISTORIAL)
    // ===============================

    public Producto buscarPorSku(String sku) {
        return productoRepository.findBySkuAndEstadoTrue(sku);
    }

    public List<Producto> buscarPorMarca(String marca) {
        return productoRepository.findByMarcaContainingIgnoreCaseAndEstadoTrue(marca);
    }

    public List<Producto> buscarPorCategoria(String categoriaNombre) {
        return productoRepository.findByCategoriaNombreIgnoreCaseAndEstadoTrue(categoriaNombre);
    }

    public List<Producto> listarActivos() {
        return productoRepository.findByEstadoTrue();
    }

    public Producto buscarPorId(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndEstadoTrue(nombre);
    }

    public List<Producto> alertaStock() {
        return productoRepository
                .findByStockActualLessThanEqualAndEstadoTrue(BigDecimal.valueOf(10));
    }

    // ===============================
    // ➕ CREAR PRODUCTO
    // ===============================

    public Producto crear(Producto producto, User usuario) {

        if (producto.getCategoria() != null &&
                producto.getCategoria().getIdCategoria() != null) {

            Categoria cat = categoriaRepository
                    .findById(producto.getCategoria().getIdCategoria())
                    .orElseThrow(() ->
                            new RuntimeException("Categoría no encontrada")
                    );

            producto.setCategoria(cat);
        }

        Producto guardado = productoRepository.save(producto);

        historialAccionService.registrar(
                usuario,
                TipoAccion.CREAR,
                TipoEntidad.PRODUCTO,
                "Producto creado ID: " + guardado.getIdProducto(),
                guardado
        );

        return guardado;
    }

    // ===============================
    // ✏️ ACTUALIZAR PRODUCTO
    // ===============================

    public Producto actualizar(Integer id, Producto producto, User usuario) {

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

        Producto actualizado = productoRepository.save(p);

        historialAccionService.registrar(
                usuario,
                TipoAccion.EDITAR,
                TipoEntidad.PRODUCTO,
                "Producto editado ID: " + actualizado.getIdProducto(),
                actualizado
        );

        return actualizado;
    }

    // ===============================
    // ❌ ELIMINAR PRODUCTO (LÓGICO)
    // ===============================

    public void eliminar(Integer id, User usuario) {

        Producto p = buscarPorId(id);

        p.setEstado(false);
        productoRepository.save(p);

        historialAccionService.registrar(
                usuario,
                TipoAccion.ELIMINAR,
                TipoEntidad.PRODUCTO,
                "Producto eliminado ID: " + id,
                p
        );
    }
}
