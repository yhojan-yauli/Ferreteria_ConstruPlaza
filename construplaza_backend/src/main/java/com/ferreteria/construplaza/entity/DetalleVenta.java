package com.ferreteria.construplaza.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "detalle_venta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Venta venta;

    @ManyToOne
    private Producto producto;

    @Column(precision = 10, scale = 3)
    private BigDecimal cantidad;
    // puede ser 1, 2.5, 3.2, etc.

    private BigDecimal precioUnitario;

    private BigDecimal subtotal;
}
