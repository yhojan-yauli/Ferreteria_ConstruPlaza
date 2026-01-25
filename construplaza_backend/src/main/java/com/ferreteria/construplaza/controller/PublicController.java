package com.ferreteria.construplaza.controller;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class PublicController {

    @GetMapping("/publico")
    public String publico() {
        return " aqui va ir lo que es publico";
    }
}