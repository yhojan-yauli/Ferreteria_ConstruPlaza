package com.ferreteria.construplaza.Auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
