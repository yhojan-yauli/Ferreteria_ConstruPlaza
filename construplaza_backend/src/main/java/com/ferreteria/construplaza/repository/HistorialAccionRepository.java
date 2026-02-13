package com.ferreteria.construplaza.repository;

import com.ferreteria.construplaza.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface HistorialAccionRepository
        extends JpaRepository<HistorialAccion, Long> {

    List<HistorialAccion> findByTipoAccion(TipoAccion tipoAccion);

    List<HistorialAccion> findByTipoEntidad(TipoEntidad tipoEntidad);

    List<HistorialAccion> findByUsuarioUsername(String username);

    List<HistorialAccion> findByFechaHoraBetween(
            LocalDateTime inicio,
            LocalDateTime fin
    );

    List<HistorialAccion> findByTipoAccionAndFechaHoraBetween(
            TipoAccion tipoAccion,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}
