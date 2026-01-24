package com.ferreteria.construplaza.Auth;

import com.ferreteria.construplaza.entity.Role;

import lombok.Data;

@Data
public class RegisterRequest {
    private String usuario;
    private String password;
    private String nombre;
    private String apellido;
    private Role rol; // CLIENTE, VENDEDOR, ADMIN, J.ALMACEN
}
