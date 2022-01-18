package com.marcin_choina.spimag.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.marcin_choina.spimag.entities.User;
import com.marcin_choina.spimag.services.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.CredentialException;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import javax.validation.executable.ValidateOnExecution;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserApiController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/login")
//    public Object login(@RequestParam("user") String username, @RequestParam("password") String pwd) {
    public Object loginApi(@RequestBody User user){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            user = userService.get(user.getLogin(), user.getPassword());
            if(user != null){
                objectNode.put("token",userService.getJWTToken(user.getLogin()));
                objectNode.put("login",user.getLogin());
                objectNode.put("name",user.getName());
                objectNode.put("surname",user.getSurname());
                objectNode.put("status","success");
                System.out.println("logowanie id="+user.getId()+", login="+user.getLogin());
                return objectNode;
            }else{
                objectNode.put("status","exception");
                objectNode.put("exception","bad credential");
                return objectNode;
            }
        }catch (Exception e) {
            objectNode.put("status","exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @PostMapping("/api/user")
    public Object addUserApi(@RequestBody /*@Valid*/ User user/*, BindingResult bindingResult*/){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
//        if(bindingResult.hasErrors()) {
//            ArrayNode arrayNode = (new ObjectMapper()).createArrayNode();
//            for (FieldError err : bindingResult.getFieldErrors()) {
//                arrayNode.add(err.getField());
//            }
//            if(arrayNode.size() > 0) {
//                objectNode.put("status", "exception");
//                objectNode.put("exception","binding exception");
//                objectNode.set("errors", arrayNode);
//                return objectNode;
//            }
//        }
        try {
            userService.add(user);
            objectNode.put("status", "success");
            return objectNode;
        }catch (ConstraintViolationException e) {
            objectNode.put("status", "exception");
            objectNode.put("exception","invalid field");
            objectNode.put("errors",e.getMessage());
            return objectNode;
        }catch (DataIntegrityViolationException e){
            System.out.println(e.getMessage());
            objectNode.put("status", "exception");
            objectNode.put("exception","integrity exception");
            return objectNode;
        }catch (Exception e) {
            System.out.println(e.getMessage());
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @PutMapping("/api/user")
//    public Object login(@RequestParam("user") String username, @RequestParam("password") String pwd) {
    public Object updateUserApi(@RequestBody ObjectNode node, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            User currentUser = userService.getUser(principal.getName());
            String name = node.has("name") ? node.get("name").asText() : null;
            String surname = node.has("surname") ? node.get("surname").asText() : null;
            String login = node.has("login") ? node.get("login").asText() : null;
            String password = node.has("password") ? node.get("password").asText() : null;
            String oldPassword = node.has("oldPassword") ? node.get("oldPassword").asText() : null;
            if(name != null && !name.isEmpty()) currentUser.setName(name);
            if(surname != null && !surname.isEmpty()) currentUser.setSurname(surname);
            if(password != null && !password.isEmpty()
                    && oldPassword != null && !oldPassword.isEmpty()){
                if(userService.checkPassword(oldPassword,currentUser.getPassword())){
                    currentUser.setPassword(userService.encodePassword(password));
                }else{
                    objectNode.put("status","exception");
                    objectNode.put("exception","bad old password");
                    return objectNode;
                }
            }
            userService.update(currentUser);
            objectNode.put("login",currentUser.getLogin());
            objectNode.put("name",currentUser.getName());
            objectNode.put("surname",currentUser.getSurname());
            objectNode.put("status","success");
            return objectNode;
        }catch (ConstraintViolationException e) {
            objectNode.put("status", "exception");
            objectNode.put("exception","invalid field");
            objectNode.put("errors",e.getMessage());
            return objectNode;
        }catch (Exception e) {
            objectNode.put("status","exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

}
