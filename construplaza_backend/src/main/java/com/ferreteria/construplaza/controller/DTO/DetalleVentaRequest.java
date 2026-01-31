package com.ferreteria.construplaza.controller.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleVentaRequest {

    private Integer idProducto;
    private BigDecimal cantidad;
}
