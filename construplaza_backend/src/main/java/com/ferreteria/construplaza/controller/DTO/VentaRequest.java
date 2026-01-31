package com.ferreteria.construplaza.controller.DTO;


import com.ferreteria.construplaza.entity.MetodoPago;
import com.ferreteria.construplaza.entity.TipoComprobante;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data

public class VentaRequest {

    private TipoComprobante tipoComprobante;
    private MetodoPago metodoPago;
    private BigDecimal montoPagado;

    private ClienteRequest cliente; // opcional
    private List<DetalleVentaRequest> detalles;
}
