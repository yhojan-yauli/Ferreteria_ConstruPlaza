package com.ferreteria.construplaza.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCliente;

    private String tipoDocumento; // DNI, RUC, NONE
    private String numeroDocumento;

    @Column(nullable = true)
    private String nombres;       // opcional
    private String razonSocial;   // empresa

    private String direccion;

    @Builder.Default
    private Boolean anonimo = false;
}