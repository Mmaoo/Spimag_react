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

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
public class AreaApiController {

    @Autowired
    ItemService itemService;

    @Autowired
    AreaService areaService;

    @Autowired
    UserService userService;

    @PostMapping("/api/area")
    public Object addAreaApi(@Valid @RequestBody Area area, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            User user = userService.getUser(principal.getName());
            area.setUser(user);
            area = areaService.add(area);
            objectNode.put("status", "success");
            objectNode.put("id", area.getId());
            return objectNode;
        }catch (Exception e) {
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @PutMapping("/api/area")
    public Object updateAreaApi(@RequestBody Area area, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            Area areaDB = areaService.get(area.getId());
            if(areaDB != null) {
                if(areaDB.getUser() == userService.getUser(principal.getName())) {
                    String name = area.getName();
                    if (name != null) areaDB.setName(name);
                    areaService.update(areaDB);
                    objectNode.put("status", "success");
                    objectNode.put("item", areaDB.getId());
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
//            e.printStackTrace();
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @GetMapping("/api/area/my")
    public Object getMyAreaApi(Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            List<Area> areas = areaService.getUserAreas(principal.getName());
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode areasNode = mapper.createArrayNode();
            for(Area area : areas){
                ObjectNode node = mapper.createObjectNode();
                node.put("id",area.getId());
                node.put("name",area.getName());
                ObjectNode userNode = mapper.createObjectNode();
                userNode.put("id", area.getUser().getId());
                userNode.put("name", area.getUser().getName());
                userNode.put("surname",area.getUser().getSurname());
                userNode.put("login",area.getUser().getLogin());
                node.set("user",userNode);
                areasNode.add(node);
            }
            objectNode.set("areas",areasNode);
            objectNode.put("status", "success");
            return objectNode;
        }catch (Exception e) {
            objectNode.put("status", "exception");
            objectNode.put("exception",e.getMessage());
            return objectNode;
        }
    }

    @DeleteMapping("/api/area")
    public Object deleteAreaApi(@RequestBody Area area, Principal principal){
        ObjectNode objectNode = (new ObjectMapper()).createObjectNode();
        try {
            Area areaDB = areaService.get(area.getId());
            if(areaDB != null){
                if(areaDB.getUser() == userService.getUser(principal.getName())) {
                    areaService.delete(areaDB);
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
