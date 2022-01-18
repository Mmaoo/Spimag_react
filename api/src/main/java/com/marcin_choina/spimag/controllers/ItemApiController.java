package com.marcin_choina.spimag.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.marcin_choina.spimag.entities.Area;
import com.marcin_choina.spimag.entities.Item;
import com.marcin_choina.spimag.entities.User;
import com.marcin_choina.spimag.services.AreaService;
import com.marcin_choina.spimag.services.ItemService;
import com.marcin_choina.spimag.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ItemApiController {

    @Autowired
    ItemService itemService;

    @Autowired
    AreaService areaService;

    @Autowired
    UserService userService;

    @PostMapping("/api/item")
    public Object addItemApi(@RequestBody Item item, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            System.out.println(item.toString());
            User user = userService.getUser(principal.getName());
            item.setUser(user);
            Area area = item.getArea();
            if(area != null){
                if(area.getId() == null){
                    area.setUser(user);
                    item.setArea(areaService.add(area));
                }else{
                    item.setArea(areaService.get(area.getId()));
                }
            }
            item = itemService.add(item);
            objectNode.put("status", "success");
            objectNode.put("id", item.getId());
            return objectNode;
        }catch (ConstraintViolationException e) {
            objectNode.put("status", "exception");
            objectNode.put("exception","invalid field");
            objectNode.put("errors",e.getMessage());
            return objectNode;
        }catch (Exception e) {
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @PutMapping("/api/item")
    public Object updateItemApi(@RequestBody Item item, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            Item itemDB = itemService.get(item.getId());
            if(itemDB != null) {
                if(itemDB.getUser() == userService.getUser(principal.getName())) {
                    String name = item.getName();
                    String itemPackage = item.getPackage();
                    Float amount = item.getAmount();
                    Area area = item.getArea();
                    if (name != null) itemDB.setName(name);
                    if (itemPackage != null) itemDB.setPackage(itemPackage);
                    if (amount != null) itemDB.setAmount(amount);
                    if (area != null) {
                        if (area.getId() == null) {
                            area.setUser(itemDB.getUser());
                            itemDB.setArea(areaService.add(area));
                        } else {
                            itemDB.setArea(areaService.get(area.getId()));
                        }
                    }
                    itemService.update(itemDB);
                    objectNode.put("status", "success");
                    objectNode.put("item", itemDB.getId());
                    return objectNode;
                }else{
                    objectNode.put("status", "exception");
                    objectNode.put("exception","you don't have permissions");
                    return objectNode;
                }
            }else{
                objectNode.put("status", "exception");
                objectNode.put("exception","item not exist");
                return objectNode;
            }
        }catch (ConstraintViolationException e) {
            objectNode.put("status", "exception");
            objectNode.put("exception","invalid field");
            objectNode.put("errors",e.getMessage());
            return objectNode;
        }catch (Exception e) {
            e.printStackTrace();
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @GetMapping({"/api/item/my","/api/item/my/area/{areaId}"})
    public Object getMyItemApi(@PathVariable(name = "areaId",required = false) Integer areaId, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            List<Item> items;
            if(areaId != null){
                Area area = areaService.get(areaId);
                if(area != null) {
                    if(area.getUser() == userService.getUser(principal.getName())) items = area.getItems();
                    else{
                        objectNode.put("status", "exception");
                        objectNode.put("exception","you don't have permissions");
                        return objectNode;
                    }
                }else items = new ArrayList<>();
            }
            else items = itemService.getUserItems(principal.getName());
            System.out.println(items);
            //            return items;
            ObjectMapper mapper = new ObjectMapper();
            //ArrayNode itemsNode = mapper.valueToTree(items);
            ArrayNode itemsNode = mapper.createArrayNode();
            for(Item item : items){
                ObjectNode node = mapper.createObjectNode();
                node.put("id",item.getId());
                node.put("name",item.getName());
                node.put("package",item.getPackage());
                node.put("amount",item.getAmount());
                ObjectNode userNode = mapper.createObjectNode();
                userNode.put("id", item.getUser().getId());
                userNode.put("name", item.getUser().getName());
                userNode.put("surname",item.getUser().getSurname());
                userNode.put("login",item.getUser().getLogin());
                node.set("user",userNode);
                if(item.getArea() != null) {
                    ObjectNode areaNode = mapper.createObjectNode();
                    areaNode.put("id",item.getArea().getId());
                    areaNode.put("name",item.getArea().getName());
                    node.set("area",areaNode);
                }
                itemsNode.add(node);
            }
            objectNode.set("items",itemsNode);
            objectNode.put("status", "success");
            System.out.println(objectNode.toString());
            return objectNode;
        }catch (Exception e) {
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @DeleteMapping("/api/item")
    public Object deleteItemApi(@RequestBody Item item,Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            Item itemDB = itemService.get(item.getId());
            if(itemDB != null){
                if(itemDB.getUser() == userService.getUser(principal.getName())) {
                    itemService.delete(itemDB);
                    objectNode.put("status", "success");
                    return objectNode;
                }else{
                    objectNode.put("status", "exception");
                    objectNode.put("exception","you don't have permissions");
                    return objectNode;
                }
            }else{
                objectNode.put("status", "exception");
                objectNode.put("exception","item not exist");
                return objectNode;
            }
        }catch (Exception e) {
            e.printStackTrace();
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }
}
