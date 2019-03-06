package com.multibank.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.multibank.domain.entity.BankCheque;
import com.multibank.repository.BankChequeRepository;


@RestController
@RequestMapping("/api/bankcheque")
public class BankChequeController {
	
	@Autowired
	BankChequeRepository bankChequeRepository;
	
	@GetMapping("/findall")
	public ResponseEntity<?> getFindAll() {
		System.out.println("+++findall+++");
		List<BankCheque> bankCheque = bankChequeRepository.findAll();
		return ResponseEntity.ok(bankCheque);
	}
	
	@GetMapping("/delete/{id}")
    public String deleteCustomer(@PathVariable Integer id) {
    	System.out.println("-----delete----- "+id);
    	
    	bankChequeRepository.deleteById(id);
    	return "Delete Successfully";
    }
}