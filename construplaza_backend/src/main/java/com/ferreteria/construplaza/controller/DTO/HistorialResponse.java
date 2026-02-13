package com.ferreteria.construplaza.controller.DTO;



import com.ferreteria.construplaza.entity.TipoAccion;

import java.time.LocalDate;
import java.time.LocalTime;

public record HistorialResponse(

        Long id,
        String usuario,
        TipoAccion accion,
        String descripcion,
        LocalDate fecha,
        LocalTime hora,
        String detalle

) {}
