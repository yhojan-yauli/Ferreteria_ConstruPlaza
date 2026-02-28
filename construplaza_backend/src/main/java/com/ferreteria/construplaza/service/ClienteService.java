package com.ferreteria.construplaza.service;

import com.ferreteria.construplaza.entity.*;
import com.ferreteria.construplaza.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClienteService {


    private final ClienteRepository clienteRepository;
    private final HistorialAccionService historialAccionService;

    private void validarDocumento(String tipoDocumento, String numeroDocumento) {
        if (numeroDocumento == null || numeroDocumento.isBlank()) return;
        if (!numeroDocumento.matches("\\d+")) {
            throw new IllegalArgumentException("El número de documento solo debe contener dígitos.");
        }
        if ("DNI".equalsIgnoreCase(tipoDocumento) && numeroDocumento.length() != 8) {
            throw new IllegalArgumentException("El DNI debe tener exactamente 8 dígitos.");
        }
        if ("RUC".equalsIgnoreCase(tipoDocumento) && numeroDocumento.length() != 11) {
            throw new IllegalArgumentException("El RUC debe tener exactamente 11 dígitos.");
        }
    }

    // ➕ CREAR CLIENTE
    public Cliente crearCliente(Cliente cliente, User usuario) {
        validarDocumento(cliente.getTipoDocumento(), cliente.getNumeroDocumento());
        cliente.setAnonimo(false);
        Cliente guardado = clienteRepository.save(cliente);

        historialAccionService.registrar(
                usuario,
                TipoAccion.CREAR,
                TipoEntidad.CLIENTE,
                "Cliente creado ID: " + guardado.getIdCliente(),
                guardado
        );

        return guardado;
    }

    // ✏️ EDITAR CLIENTE
    public Cliente editarCliente(Integer id, Cliente datos, User usuario) {
        validarDocumento(datos.getTipoDocumento(), datos.getNumeroDocumento());
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setTipoDocumento(datos.getTipoDocumento());
        cliente.setNumeroDocumento(datos.getNumeroDocumento());
        cliente.setNombres(datos.getNombres());
        cliente.setRazonSocial(datos.getRazonSocial());
        cliente.setDireccion(datos.getDireccion());

        Cliente actualizado = clienteRepository.save(cliente);

        historialAccionService.registrar(
                usuario,
                TipoAccion.EDITAR,
                TipoEntidad.CLIENTE,
                "Cliente editado ID: " + actualizado.getIdCliente(),
                actualizado
        );

        return actualizado;
    }

    // ❌ ELIMINAR CLIENTE (lógico)
    public void eliminarCliente(Integer id, User usuario) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setAnonimo(true);
        clienteRepository.save(cliente);

        historialAccionService.registrar(
                usuario,
                TipoAccion.ELIMINAR,
                TipoEntidad.CLIENTE,
                "Cliente marcado como anónimo ID: " + id,
                cliente
        );
    }
}
