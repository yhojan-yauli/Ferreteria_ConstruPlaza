package com.ferreteria.construplaza.controller.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {

	private Integer id;
	private String nombre;
	private String sku;
	private String marca;
	private String categoria;
	private Double precio;
	private Integer stock;
	private String imagen;
}
