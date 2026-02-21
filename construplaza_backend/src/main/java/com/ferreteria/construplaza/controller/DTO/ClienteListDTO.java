package com.ferreteria.construplaza.controller.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteListDTO {

	private Integer id;
	private String tipoDocumento;
	private String numeroDocumento;
	private String nombres;
	private String razonSocial;
	private String direccion;
}
