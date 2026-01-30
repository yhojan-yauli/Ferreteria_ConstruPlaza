package com.ferreteria.construplaza.controller.DTO;

import lombok.Data;

@Data
public class ClienteRequest {

    private Boolean anonimo;

    private String tipoDocumento; // DNI, RUC
    private String numeroDocumento;

    private String nombres;
    private String razonSocial;
    private String direccion;
}
