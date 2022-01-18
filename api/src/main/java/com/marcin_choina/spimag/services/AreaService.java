package com.marcin_choina.spimag.services;

import com.marcin_choina.spimag.entities.Area;
import com.marcin_choina.spimag.entities.Item;
import com.marcin_choina.spimag.repositories.AreaRepository;
import com.marcin_choina.spimag.repositories.ItemRepository;
import com.marcin_choina.spimag.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AreaService {

    @Autowired
    private Validator validator;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private UserRepository userRepository;

    public Area add(Area area){
        Set<ConstraintViolation<Area>> violations = validator.validate(area);
        if(!violations.isEmpty()){
            StringBuilder sb = new StringBuilder();
            for(ConstraintViolation<Area> cv : violations){
                sb.append(cv.getMessage()).append(", ");
            }
            throw new ConstraintViolationException(sb.toString(),violations);
        }else return areaRepository.save(area);
    }

    public Area update(Area area){
        Set<ConstraintViolation<Area>> violations = validator.validate(area);
        if(!violations.isEmpty()){
            StringBuilder sb = new StringBuilder();
            for(ConstraintViolation<Area> cv : violations){
                sb.append(cv.getMessage()).append(", ");
            }
            throw new ConstraintViolationException(sb.toString(),violations);
        }else return areaRepository.save(area);
    }

    public List<Area> getUserAreas(String name){
        return userRepository.findByLogin(name).getAreas();
    }

    public Area get(int id){
        Optional<Area> areaOptional = areaRepository.findById(id);
        return areaOptional.orElse(null);
    }

    public void delete(Area area){
        for(Item item : area.getItems()){
            item.setArea(null);
            itemRepository.save(item);
        }
        areaRepository.delete(area);
    }
}
