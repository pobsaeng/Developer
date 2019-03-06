package com.multibank.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.multibank.domain.entity.Menu;
import com.multibank.repository.MenuRepository;


@RestController
@RequestMapping("/api/treemenu")
public class MenuController {
	
	@Autowired
	MenuRepository menuRepository;

    @GetMapping("/findall")
    public ResponseEntity<?> getTreeMenus() {
    	List<Menu> listTreeMenu = menuRepository.findAll();
		return new ResponseEntity(listTreeMenu, HttpStatus.OK);
    }
}