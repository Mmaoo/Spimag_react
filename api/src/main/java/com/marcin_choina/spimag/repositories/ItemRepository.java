package com.marcin_choina.spimag.repositories;

import com.marcin_choina.spimag.entities.Item;
import com.marcin_choina.spimag.entities.User;
import org.springframework.data.repository.CrudRepository;

public interface ItemRepository extends CrudRepository<Item,Integer> {
}
