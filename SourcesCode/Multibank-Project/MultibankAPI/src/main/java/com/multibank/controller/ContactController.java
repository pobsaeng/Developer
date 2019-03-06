package com.multibank.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.multibank.domain.entity.Contact;
import com.multibank.domain.entity.Customer;
import com.multibank.domain.entity.User;
import com.multibank.exception.ResourceNotFoundException;
import com.multibank.model.json.request.ContactRequest;
import com.multibank.model.json.request.CustomerRequest;
import com.multibank.repository.ContactRepository;


@RestController
@RequestMapping("/api/contact")
public class ContactController {
	
	@Autowired
	ContactRepository contactRepository;
	
	@GetMapping("/findall")
	public ResponseEntity<?> getFindAll() {
		System.out.println("+++findall+++");
		List<Contact> contacts = contactRepository.findAll();
		System.out.println(contacts);
		return ResponseEntity.ok(contacts);
	}

	@PostMapping("/save")
    public Contact addHoliday(@RequestBody ContactRequest contactRequest) {
		System.out.println(contactRequest);
		Contact contact = new Contact();
		contact.setCustomer_name(contactRequest.getCustomer_name());
		contact.setMobile(contactRequest.getMobile());
		contact.setEmail(contactRequest.getEmail());
		return contactRepository.save(contact);
    }
	@PutMapping("/update")
	public ResponseEntity<?> updateContact(@RequestBody ContactRequest contactRequest) {
		System.out.println("==== Update Contact! ====");;
		
		if (!contactRepository.existsById(contactRequest.getContact_id())) {
			throw new ResourceNotFoundException("Contact not found with id " + contactRequest.getContact_id(), null, null);
		}
		// insert into a User table
		Contact contact = contactRepository.findById(contactRequest.getContact_id()).map(ct -> {
			ct.setContact_id(contactRequest.getContact_id());
			ct.setCustomer_name(contactRequest.getCustomer_name());
			ct.setMobile(contactRequest.getMobile());
			ct.setEmail(contactRequest.getEmail());
			return contactRepository.save(ct);
		}).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + contactRequest.getContact_id(), null,
				null));
		return ResponseEntity.ok(contact);
	}
	@GetMapping("/delete/{id}")
    public String deleteCustomer(@PathVariable Integer id) {
    	System.out.println("-----delete----- "+id);
    	
    	contactRepository.deleteById(id);
    	return "Delete Successfully";
    }
}