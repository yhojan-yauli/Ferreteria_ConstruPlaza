package com.ferreteria.construplaza.controller.DTO;

import com.ferreteria.construplaza.entity.Cliente;
import com.ferreteria.construplaza.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/construplaza/vendedor/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    // 🔎 Listar clientes (NO anónimos)
    @GetMapping
    public ResponseEntity<?> listarClientes() {
        List<Cliente> clientes = clienteRepository.findByAnonimoFalse();

        if (clientes.isEmpty()) {
            return ResponseEntity.ok("No hay clientes registrados");
        }
        return ResponseEntity.ok(clientes);
    }

    // 🔍 Buscar por número de documento
    @GetMapping("/documento/{numero}")
    public ResponseEntity<Cliente> buscarPorDocumento(@PathVariable String numero) {

        return clienteRepository.findByNumeroDocumento(numero)
                .map(ResponseEntity::ok)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado")
                );
    }



    // ➕ Registrar cliente
    @PostMapping
    public Cliente registrarCliente(@RequestBody Cliente cliente) {

        cliente.setAnonimo(false); // aseguramos
        return clienteRepository.save(cliente);
    }

    // ✏️ Editar cliente
    @PutMapping("/{id}")
    public Cliente editarCliente(
            @PathVariable Integer id,
            @RequestBody Cliente datos
    ) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setTipoDocumento(datos.getTipoDocumento());
        cliente.setNumeroDocumento(datos.getNumeroDocumento());
        cliente.setNombres(datos.getNombres());
        cliente.setRazonSocial(datos.getRazonSocial());
        cliente.setDireccion(datos.getDireccion());

        return clienteRepository.save(cliente);
    }

    // ❌ Eliminación lógica → lo volvemos anónimo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setAnonimo(true);
        clienteRepository.save(cliente);

        return ResponseEntity.ok("Cliente marcado como anónimo");
    }
}
