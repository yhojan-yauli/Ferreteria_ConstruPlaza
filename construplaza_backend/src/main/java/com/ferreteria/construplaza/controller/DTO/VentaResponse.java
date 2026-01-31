package com.ferreteria.construplaza.controller.DTO;


import com.ferreteria.construplaza.entity.MetodoPago;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class VentaResponse {

    private Integer idVenta;
    private LocalDateTime fechaEmision;

    private String tipoComprobante;
    private String serie;
    private String numero;

    private BigDecimal totalGravado;
    private BigDecimal igv;
    private BigDecimal total;

    private String metodoPago;
    private BigDecimal montoPagado;
    private BigDecimal vuelto;

    // SOLO lo necesario
    private VendedorDTO vendedor;
    private ClienteDTO cliente;



}
