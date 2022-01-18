package com.marcin_choina.spimag.repositories;

import com.marcin_choina.spimag.entities.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User,Integer> {
    public User findByLogin(String login);
    public User findByLoginAndPassword(String login, String password);
}
