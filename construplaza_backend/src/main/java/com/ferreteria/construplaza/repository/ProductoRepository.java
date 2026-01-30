package com.ferreteria.construplaza.repository;

import com.ferreteria.construplaza.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


import java.math.BigDecimal;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByEstadoTrue();

    List<Producto> findByStockActualLessThanEqualAndEstadoTrue(BigDecimal stockMinimo);

    List<Producto> findByNombreContainingIgnoreCaseAndEstadoTrue(String nombre);

    // Nueva búsqueda por SKU exacto
    Producto findBySkuAndEstadoTrue(String sku);

    // Buscar por marca
    List<Producto> findByMarcaContainingIgnoreCaseAndEstadoTrue(String marca);

    // Buscar por categoría
    List<Producto> findByCategoriaNombreIgnoreCaseAndEstadoTrue(String categoriaNombre);
}
