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

    // ➕ CREAR CLIENTE
    public Cliente crearCliente(Cliente cliente, User usuario) {

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
