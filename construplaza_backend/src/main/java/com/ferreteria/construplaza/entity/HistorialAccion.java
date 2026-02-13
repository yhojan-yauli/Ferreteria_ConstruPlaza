package com.ferreteria.construplaza.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_acciones")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistorialAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_accion")
    private TipoAccion tipoAccion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entidad")
    private TipoEntidad tipoEntidad;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
}
