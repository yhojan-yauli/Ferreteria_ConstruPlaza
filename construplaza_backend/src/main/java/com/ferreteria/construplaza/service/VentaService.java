package com.ferreteria.construplaza.service;

import com.ferreteria.construplaza.controller.DTO.DetalleVentaRequest;
import com.ferreteria.construplaza.controller.DTO.VentaRequest;
import com.ferreteria.construplaza.entity.*;
import com.ferreteria.construplaza.repository.ClienteRepository;
import com.ferreteria.construplaza.repository.DetalleVentaRepository;
import com.ferreteria.construplaza.repository.ProductoRepository;
import com.ferreteria.construplaza.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;

    // 🔹 REGISTRAR VENTA
    public Venta registrarVenta(VentaRequest request, User vendedor) {

        if (request.getDetalles().isEmpty()) {
            throw new RuntimeException("La venta no puede estar vacía");
        }

        Cliente cliente = null;

        if (request.getCliente() != null && !request.getCliente().getAnonimo()) {

            cliente = Cliente.builder()
                    .anonimo(false)
                    .tipoDocumento(request.getCliente().getTipoDocumento())
                    .numeroDocumento(request.getCliente().getNumeroDocumento())
                    .nombres(request.getCliente().getNombres())
                    .razonSocial(request.getCliente().getRazonSocial())
                    .direccion(request.getCliente().getDireccion())
                    .build();

            cliente = clienteRepository.save(cliente);
        }

        Venta venta = Venta.builder()
                .fechaEmision(LocalDateTime.now())
                .tipoComprobante(request.getTipoComprobante())
                .serie(request.getTipoComprobante() == TipoComprobante.BOLETA ? "B001" : "F001")
                .numero(String.valueOf(System.currentTimeMillis()))
                .metodoPago(request.getMetodoPago())
                .montoPagado(request.getMontoPagado())
                .vendedor(vendedor)
                .cliente(cliente)
                .build();

        venta = ventaRepository.save(venta);

        BigDecimal totalGravado = BigDecimal.ZERO;

        for (DetalleVentaRequest d : request.getDetalles()) {

            Producto producto = productoRepository.findById(d.getIdProducto())
                    .orElseThrow();

            if (producto.getStockActual().compareTo(d.getCantidad()) < 0) {
                throw new RuntimeException("Stock insuficiente");
            }

            BigDecimal subtotal = producto.getPrecioVenta()
                    .multiply(d.getCantidad());

            producto.setStockActual(producto.getStockActual().subtract(d.getCantidad()));
            productoRepository.save(producto);

            detalleVentaRepository.save(
                    DetalleVenta.builder()
                            .venta(venta)
                            .producto(producto)
                            .cantidad(d.getCantidad())
                            .precioUnitario(producto.getPrecioVenta())
                            .subtotal(subtotal)
                            .build()
            );

            totalGravado = totalGravado.add(subtotal);
        }

        BigDecimal igv = totalGravado.multiply(new BigDecimal("0.18"));
        BigDecimal total = totalGravado.add(igv);

        venta.setTotalGravado(totalGravado);
        venta.setIgv(igv);
        venta.setTotal(total);
        venta.setVuelto(request.getMontoPagado().subtract(total));

        return ventaRepository.save(venta);
    }

    // 🔹 VENTAS POR VENDEDOR
    public List<Venta> ventasPorVendedor(Integer vendedorId) {
        return ventaRepository.findByVendedorId(vendedorId);
    }
}
