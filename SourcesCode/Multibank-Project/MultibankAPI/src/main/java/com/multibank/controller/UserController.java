package com.multibank.controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.multibank.domain.entity.Item;
import com.multibank.domain.entity.User;
import com.multibank.exception.ResourceNotFoundException;
import com.multibank.model.json.request.ListItems;
import com.multibank.model.json.request.SignUpRequest;
import com.multibank.repository.ItemsRepository;
import com.multibank.repository.RoleRepository;
import com.multibank.repository.UserRepository;
import com.multibank.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	UserRepository userRepository;
	@Autowired
	ItemsRepository itemsRepository;
	@Autowired
	RoleRepository roleRepository;
	@Autowired
	UserService userService;
	@Autowired
	PasswordEncoder passwordEncoder;

	@GetMapping("/findall")
	public ResponseEntity<?> getFindAll() {
		List<User> users = userRepository.findAllUsers();

		Map<String, Object> baseMap = new HashMap<>();
		Map<String, Object> mobj = new HashMap<>();
		Map<String, Object> map = null;
		List<Map<String, Object>> lsItems = null;

		if (users != null) {
			for (int i = 0; i < users.size(); i++) {
				lsItems = new ArrayList<>();

				map = new TreeMap<>();
				map.put("data", users.get(i));

				try {
					List<Item> listItems = itemsRepository.findItemByUserItemId(users.get(i).getUser_id());
					map.put("menu", listItems);

				} catch (Exception e) {
					map.put("menu", new ArrayList());
				}

				mobj.put("user" + i, map);
				lsItems.add(mobj);
			}

		} else {
			lsItems = new ArrayList<>();
		}

		baseMap.put("result", lsItems);

		return new ResponseEntity(baseMap, HttpStatus.OK);
	}
	 
	@PutMapping("/update")
	public ResponseEntity<?> updateAnswer(@RequestBody SignUpRequest signUpRequest) {
		System.out.println("==== Update Service ====");
//		HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
//		System.out.println("IP: " + req.getRemoteAddr());
		
		if (!userRepository.existsById(signUpRequest.getUser_id())) {
			throw new ResourceNotFoundException("User not found with id " + signUpRequest.getUser_id(), null, null);
		}
		// insert into a User table
		User user = userRepository.findById(signUpRequest.getUser_id()).map(u -> {
			u.setUser_id(signUpRequest.getUser_id());
			u.setFullname(signUpRequest.getFullname());
			u.setEmail(signUpRequest.getEmail());
			u.setDepartment(signUpRequest.getDepartment());
			u.setIp_address(signUpRequest.getIp_address());
			return userRepository.save(u);
		}).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + signUpRequest.getUser_id(), null,
				null));

		if (user != null) {
			List<Item> lsItems = itemsRepository.findItemByUserItemId(user.getUser_id());
			// remove all items which belong to this user
			if (lsItems != null) {
				for (Item itm : lsItems) {
					itemsRepository.deleteById(itm.getItem_id());
				}
				// insert new items into the 'items' table
				saveItems(signUpRequest.getItems(), user.getUser_id());
			}
		}
		return ResponseEntity.ok(user);
	}

	private void saveItems(List<ListItems> listItems, Integer user_item_id) {
		for (ListItems itm : listItems) {
			Item items = new Item();
			items.setName(itm.getName());
			items.setUser_id(user_item_id);
			items.setMenu_id(itm.getItem_id());
			items.setPrivilege(itm.getPrivilege());
			itemsRepository.save(items);
		}
	}

	@GetMapping("/delete/{user_id}")
	public ResponseEntity<?> deleteUser(@PathVariable("user_id") Integer user_id) throws Exception {
		return userRepository.findById(user_id).map(user -> {
			try {
				List<Item> lsItems = itemsRepository.findItemByUserItemId(user.getUser_id());
				if (lsItems != null) {
					for (Item item : lsItems) {
						itemsRepository.deleteById(item.getItem_id());
					}
				}
				userRepository.deleteById(user.getUser_id());

			} catch (Exception e) {
				return ResponseEntity.notFound().build();
			}
			return ResponseEntity.ok().build();
		}).orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/findbyuser/{user_id}")
	public ResponseEntity<?> getFinByUser(@PathVariable("user_id") Integer user_id) {
		System.out.println("user_id: " + user_id);
		Map<String, Object> mResult = userService.findByUserId(user_id);
		return new ResponseEntity(mResult, HttpStatus.OK);
	}

	@PostMapping("currentuser")
	public ResponseEntity<?> getCurrentUser() {
		System.out.println("---getCurrentUser---");
		// UserPrincipal user =
		// (UserPrincipal)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		} else {
			username = principal.toString();
		}

		return new ResponseEntity(username, HttpStatus.OK);
	}
}