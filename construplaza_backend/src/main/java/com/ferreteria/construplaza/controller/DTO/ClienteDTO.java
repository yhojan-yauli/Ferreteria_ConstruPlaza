package com.ferreteria.construplaza.controller.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClienteDTO {
    private Integer idCliente;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String razonSocial;
    private String direccion;
}
