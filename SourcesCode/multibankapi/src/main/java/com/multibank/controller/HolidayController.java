package com.multibank.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.multibank.domain.entity.Holiday;
import com.multibank.repository.HolidayRepository;


@RestController
@RequestMapping("/api/holiday")
public class HolidayController {
	
	@Autowired
	HolidayRepository holidayRepository;

    @GetMapping("/holidays")
    public ResponseEntity<?> getHolidays() {
    	List<Holiday> listHoliday = holidayRepository.findAll();
		return new ResponseEntity(listHoliday, HttpStatus.OK);
    }
    
    @PostMapping("/add")
    public Holiday addHoliday(@RequestBody Holiday holiday) {
		return holidayRepository.save(holiday);
    }
    
    @GetMapping("/delete/{id}")
    public String deleteHoliday(@PathVariable String id) {
    	System.out.println("-----delete----- "+id);
    	
    	holidayRepository.deleteById(new Long(id));
    	return "Delete Successfully";
    }
}