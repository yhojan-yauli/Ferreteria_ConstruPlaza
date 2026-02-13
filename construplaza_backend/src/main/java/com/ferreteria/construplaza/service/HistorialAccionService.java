package com.ferreteria.construplaza.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ferreteria.construplaza.entity.*;
import com.ferreteria.construplaza.repository.HistorialAccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class HistorialAccionService {

    private  final HistorialAccionRepository historialRepo;
    private final ObjectMapper objectMapper;

    public void registrar(User usuario,
                          TipoAccion tipoAccion,
                          TipoEntidad tipoEntidad,
                          String descripcion,
                          Object detalleObjeto) {

        try {

            String detalleJson = null;

            if (detalleObjeto != null) {
                detalleJson = objectMapper.writeValueAsString(detalleObjeto);
            }

            HistorialAccion historial = new HistorialAccion();
            historial.setUsuario(usuario);
            historial.setTipoAccion(tipoAccion);
            historial.setTipoEntidad(tipoEntidad);
            historial.setDescripcion(descripcion);
            historial.setDetalle(detalleJson);
            historial.setFechaHora(LocalDateTime.now());

            historialRepo.save(historial);

        } catch (Exception e) {
            throw new RuntimeException("Error guardando historial", e);
        }
    }
}
