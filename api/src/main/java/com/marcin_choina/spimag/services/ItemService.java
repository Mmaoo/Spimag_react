package com.marcin_choina.spimag.services;

import com.marcin_choina.spimag.entities.Area;
import com.marcin_choina.spimag.entities.Item;
import com.marcin_choina.spimag.entities.User;
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
public class ItemService {

    @Autowired
    private Validator validator;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private UserRepository userRepository;

    public Item add(Item item){
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        if(!violations.isEmpty()){
            StringBuilder sb = new StringBuilder();
            for(ConstraintViolation<Item> cv : violations){
                sb.append(cv.getMessage()).append(", ");
            }
            throw new ConstraintViolationException(sb.toString(),violations);
        }else return itemRepository.save(item);
    }

    public Item update(Item item){
        Set<ConstraintViolation<Item>> violations = validator.validate(item);
        if(!violations.isEmpty()){
            StringBuilder sb = new StringBuilder();
            for(ConstraintViolation<Item> cv : violations){
                sb.append(cv.getMessage()).append(", ");
            }
            throw new ConstraintViolationException(sb.toString(),violations);
        }else return itemRepository.save(item);
    }

    public List<Item> getUserItems(String name){
        return userRepository.findByLogin(name).getItems();
    }

    public Item get(int id){
        Optional<Item> itemOptional = itemRepository.findById(id);
        return itemOptional.orElse(null);
    }

    public void delete(Item item){
        itemRepository.delete(item);
    }
}
