package com.ferreteria.construplaza.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProducto;

    @Column(unique = true)
    private String sku;

    @Column(nullable = false)
    private String nombre;

    private String marca;

    private String descripcion;

    @Column(nullable = false)
    private BigDecimal precioCompra;

    @Column(nullable = false)
    private BigDecimal precioVenta;

    // 🔥 Cantidad en unidad base (UND, KG, M, etc.)
    @Column(nullable = false)
    private BigDecimal stockActual;

    @Column(nullable = false)
    private BigDecimal stockMinimo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnidadMedida unidadMedida;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    private String imagenUrl;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;
}
