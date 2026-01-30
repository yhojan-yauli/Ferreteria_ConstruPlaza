package com.ferreteria.construplaza.entity;

import com.ferreteria.construplaza.entity.Cliente;
import com.ferreteria.construplaza.entity.TipoComprobante;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVenta;

    private LocalDateTime fechaEmision;

    @Enumerated(EnumType.STRING)
    private TipoComprobante tipoComprobante; // BOLETA / FACTURA

    private String serie;   // B001 / F001
    private String numero;  // correlativo

    private BigDecimal totalGravado;
    private BigDecimal igv;
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago; // EFECTIVO, TARJETA, YAPE

    private BigDecimal montoPagado;
    private BigDecimal vuelto;

    @ManyToOne
    private User vendedor;

    @ManyToOne(optional = true)
    private Cliente cliente;
}
