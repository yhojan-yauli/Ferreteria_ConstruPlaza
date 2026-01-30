package com.ferreteria.construplaza.repository;


import com.ferreteria.construplaza.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Integer> {

    // Ventas por vendedor
    List<Venta> findByVendedorId(Integer vendedorId);
}
