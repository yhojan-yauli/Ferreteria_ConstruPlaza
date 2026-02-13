package com.ferreteria.construplaza.controller.DTO;

import com.ferreteria.construplaza.entity.Cliente;
import com.ferreteria.construplaza.entity.User;
import com.ferreteria.construplaza.repository.ClienteRepository;
import com.ferreteria.construplaza.repository.UserRepository;
import com.ferreteria.construplaza.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/construplaza/vendedor/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN','VENDEDOR')")
public class    ClienteController {

    private final ClienteService clienteService;
    private final ClienteRepository clienteRepository;
    private final UserRepository userRepository;

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

    // ➕ Registrar cliente (CON HISTORIAL)
    @PostMapping
    public Cliente registrarCliente(@RequestBody ClienteRequest clienteRequest) {

        Cliente cliente = Cliente.builder()
                .tipoDocumento(clienteRequest.getTipoDocumento())
                .numeroDocumento(clienteRequest.getNumeroDocumento())
                .nombres(clienteRequest.getNombres())
                .razonSocial(clienteRequest.getRazonSocial())
                .direccion(clienteRequest.getDireccion())
                .anonimo(false)
                .build();

        User usuario = obtenerUsuarioAutenticado();
        return clienteService.crearCliente(cliente, usuario);
    }

    // ✏️ Editar cliente (CON HISTORIAL)
    @PutMapping("/{id}")
    public Cliente editarCliente(
            @PathVariable Integer id,
            @RequestBody Cliente datos
    ) {
        User usuario = obtenerUsuarioAutenticado();
        return clienteService.editarCliente(id, datos, usuario);
    }

    // ❌ Eliminación lógica → lo volvemos anónimo (CON HISTORIAL)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Integer id) {

        User usuario = obtenerUsuarioAutenticado();
        clienteService.eliminarCliente(id, usuario);

        return ResponseEntity.ok("Cliente marcado como anónimo");
    }

    // 🔐 Obtener usuario autenticado
    private User obtenerUsuarioAutenticado() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
