package com.marcin_choina.spimag.entities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;

@ToString
@Getter @Setter
@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @NotNull
    @Pattern(regexp = "[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9 ]{1,30}",message = "Nazwa nie może być pusta i nie może zawierać znaków specjalnych")
    private String name;

    @NotNull
    @Min(value = 0,message = "Liczba przedmiotów nie może być ujemna")
    @ColumnDefault("0")
    private Float amount;

    @Pattern(regexp = "[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9 ]{0,30}",message = "Nazwa opakowania nie może zawierać znaków specjalnych")
    private String Package;

    @ManyToOne
    @JoinColumn(nullable = true)
    private Area area;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

}
