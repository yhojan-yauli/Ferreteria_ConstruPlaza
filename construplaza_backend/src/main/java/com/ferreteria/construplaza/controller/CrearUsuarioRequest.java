package com.ferreteria.construplaza.controller;


import com.ferreteria.construplaza.entity.Role;
import lombok.Data;

@Data
public class CrearUsuarioRequest {

    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private Role role;
}
