package com.marcin_choina.spimag.entities;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    @Pattern(regexp = "[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,30}",message = "Imię musi zawierać 3-30 znaków, wyłączając litery i znaki specjalne")
    private String name;

    @NotNull
    @Pattern(regexp = "[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,30}",message = "Nazwisko musi zawierać 3-30 znaków, wyłączając litery i znaki specjalne")
    private String surname;

    @NotNull
    @Column(unique = true)
    @Pattern(regexp = "[a-zA-Z][a-zA-Z0-9]{4,30}",message = "Login musi zawierać 4-30 znaków, wyłączając znaki specjalne i musi zaczynać się od litery")
    private String login;

    @NotNull
    private String password;

    @OneToMany(mappedBy = "user",orphanRemoval = true)
    private List<Item> items;

    @OneToMany(mappedBy = "user",orphanRemoval = true)
    private List<Area> areas;

    public User(){
        this.items = new ArrayList<>();
        this.areas = new ArrayList<>();
    }

    public User(String name, String surname, String login, String password) {
        this.name = name;
        this.surname = surname;
        this.login = login;
        this.password = password;
        this.items = new ArrayList<>();
        this.areas = new ArrayList<>();
    }

    @Override
    public String toString() {
        return "User{" +
                "userid=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", login='" + login + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
