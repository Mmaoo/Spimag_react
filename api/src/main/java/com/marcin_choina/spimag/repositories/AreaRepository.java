package com.marcin_choina.spimag.repositories;

import com.marcin_choina.spimag.entities.Area;
import com.marcin_choina.spimag.entities.User;
import org.springframework.data.repository.CrudRepository;

public interface AreaRepository extends CrudRepository<Area,Integer> {
}
