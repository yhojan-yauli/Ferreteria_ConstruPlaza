package com.ferreteria.construplaza.controller.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VendedorDTO {
    private Integer id;
    private String username;
    private String firstname;
    private String lastname;
}
