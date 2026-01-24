package com.ferreteria.construplaza.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/construplaza")
public class VendedorController {

    @GetMapping("/ventas")
    public String reservas() {
        return "Gestión de ventas.";
    }
}
