package com.marcin_choina.spimag.services;

import com.marcin_choina.spimag.entities.User;
import com.marcin_choina.spimag.repositories.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.persistence.EntityNotFoundException;
import javax.validation.*;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private Validator validator;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public User getUser(String name){
        return userRepository.findByLogin(name);
    }

    public User get(String login, String password){
        User user =  userRepository.findByLogin(login);
        if(user == null) throw new BadCredentialsException("Username not found");
        if(passwordEncoder.matches(password,user.getPassword())){
            return user;
        }else throw new BadCredentialsException("Password don't pass");
    }

    public void add(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if(!violations.isEmpty()){
            StringBuilder sb = new StringBuilder();
            for(ConstraintViolation<User> cv : violations){
//                System.out.println(cv.getMessage());
                sb.append(cv.getMessage()).append(", ");
            }
            throw new ConstraintViolationException(sb.toString(),violations);
        }else userRepository.save(user);
    }

    public void update(User user){
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        if(!violations.isEmpty()){
            StringBuilder sb = new StringBuilder();
            for(ConstraintViolation<User> cv : violations){
//                System.out.println(cv.getMessage());
                sb.append(cv.getMessage()).append(", ");
            }
            throw new ConstraintViolationException(sb.toString(),violations);
        }else userRepository.save(user);
    }

    public String encodePassword(String pass){
        return passwordEncoder.encode(pass);
    }

    public Boolean checkPassword(String rawPassword, String encodedPassword){
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String getJWTToken(String username) {
        String secretKey = "mySecretKey";
        List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                .commaSeparatedStringToAuthorityList("ROLE_USER");

        String token = Jwts
                .builder()
                .setId("spimagJWT")
                .setSubject(username)
                .claim("authorities",
                        grantedAuthorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 600000))
                .signWith(SignatureAlgorithm.HS512,
                        secretKey.getBytes()).compact();

        return "Bearer " + token;
    }
}
