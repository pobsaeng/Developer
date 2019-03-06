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

import com.multibank.domain.entity.Customer;
import com.multibank.exception.ResourceNotFoundException;
import com.multibank.model.json.request.CustomerRequest;
import com.multibank.repository.CustomerRepository;


@RestController
@RequestMapping("/api/customer")
public class CustomerController {
	
	@Autowired
	CustomerRepository customerRepository;
	
//	@GetMapping("/movies/search/query")
//    public ResponseEntity<?> query(@RequestParam("q") String query, Pageable pageable) {
//        Page<Customer> page = customerRepository.search(QueryBuilders.queryStringQuery(query), pageable);
//        return ResponseEntity.ok(pagedAssembler.toResource(page, movieResourceAssembler));
//    }
	
	@GetMapping("/findall")
	public ResponseEntity<?> getFindAll() {
		System.out.println("+++findall+++");
		List<Customer> customers = customerRepository.findAll();
		System.out.println(customers);
		return ResponseEntity.ok(customers);
	}
	
	@GetMapping("/findbyid/{customer_id}")
	public ResponseEntity<?> getUserById(@PathVariable("customer_id") Integer customer_id) {
		Customer customer = customerRepository.findById(customer_id).orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customer_id));
		return new ResponseEntity(customer, HttpStatus.OK);
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateAnswer(@RequestBody CustomerRequest customerRequest) {
		System.out.println("==== Update Service ====");;
		
		if (!customerRepository.existsById(customerRequest.getCustomerID())) {
			throw new ResourceNotFoundException("User not found with id " + customerRequest.getCustomerID(), null, null);
		}
		// insert into a User table
		Customer customer = customerRepository.findById(customerRequest.getCustomerID()).map(cust -> {
			cust.setCustomerID(customerRequest.getCustomerID());
			cust.setAccountName(customerRequest.getAccountName());
			cust.setAccountNumber(customerRequest.getAccountNumber());
			cust.setAccountBranch(customerRequest.getAccountBranch());
			cust.setClientCode(customerRequest.getClientCode());
			cust.setDownloadTime(customerRequest.getDownloadTime());
			cust.setReferenceNumber1(customerRequest.getReferenceNumber1());
			cust.setReferenceNumber2(customerRequest.getReferenceNumber2());
			
			return customerRepository.save(cust);
		}).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + customerRequest.getCustomerID(), null,
				null));
		return ResponseEntity.ok(customer);
	}

	@PostMapping("/save")
    public Customer addHoliday(@RequestBody CustomerRequest customerRequest) {
		System.out.println(customerRequest);
		Customer customer = new Customer();
		customer.setCustomerID(customerRequest.getCustomerID());
		customer.setAccountName(customerRequest.getAccountName());
		customer.setAccountNumber(customerRequest.getAccountNumber());
		customer.setAccountBranch(customerRequest.getAccountBranch());
		customer.setClientCode(customerRequest.getClientCode());
		customer.setDownloadTime(customerRequest.getDownloadTime());
		customer.setReferenceNumber1(customerRequest.getReferenceNumber1());
		customer.setReferenceNumber2(customerRequest.getReferenceNumber2());
		return customerRepository.save(customer);
    }
	@GetMapping("/delete/{id}")
    public String deleteCustomer(@PathVariable Integer id) {
    	System.out.println("-----delete----- "+id);
    	
    	customerRepository.deleteById(id);
    	return "Delete Successfully";
    }
}