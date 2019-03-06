package com.multibank.controller;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.multibank.baseconfig.JwtTokenProvider;
import com.multibank.baseconfig.UserPrincipal;
import com.multibank.domain.entity.Item;
import com.multibank.domain.entity.Menu;
import com.multibank.domain.entity.Role;
import com.multibank.domain.entity.RoleName;
import com.multibank.domain.entity.User;
import com.multibank.exception.APIException;
import com.multibank.exception.AppException;
import com.multibank.exception.ResourceNotFoundException;
import com.multibank.model.json.request.ListItems;
import com.multibank.model.json.request.LoginRequest;
import com.multibank.model.json.request.ResetPassRequest;
import com.multibank.model.json.request.SignUpRequest;
import com.multibank.model.json.response.JwtAuthenResponse;
import com.multibank.repository.ItemsRepository;
import com.multibank.repository.MenuRepository;
import com.multibank.repository.RoleRepository;
import com.multibank.repository.UserRepository;
import com.multibank.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;
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
	@Autowired
	JwtTokenProvider tokenProvider;
	@Autowired
	MenuRepository menuRepository;
	
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) throws APIException{
		System.out.println("--------AuthController[signin]------------");
		System.out.println(loginRequest);
		
		if(loginRequest.getUsername().equals("")) {
			throw new APIException(
					"Usernae is require!",
					HttpServletResponse.SC_UNAUTHORIZED,
					HttpStatus.BAD_REQUEST.value(),
					request.getServletPath(),
					new Timestamp(System.currentTimeMillis())
					);
			
		}else if(loginRequest.getPassword().equals("")) {
			throw new APIException(
					"Password is require!",
					HttpServletResponse.SC_UNAUTHORIZED,
					HttpStatus.BAD_REQUEST.value(),
					request.getServletPath(),
					new Timestamp(System.currentTimeMillis())
					);
		}
		UsernamePasswordAuthenticationToken userpassauthen = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());				
		Authentication authentication = authenticationManager.authenticate(userpassauthen);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
		System.out.println(userPrincipal);
		
		String jwt = tokenProvider.generateToken(authentication);
		System.out.println("[jwt: " + tokenProvider.getUserIdFromJWT(jwt) + "]");
		
		Map<String, Object> map = new HashMap<>();
		map.put("token", new JwtAuthenResponse(jwt));
		
		if(userPrincipal != null) {		
			User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
					() -> new ResourceNotFoundException("Not Found!", "User_id", "NULL"));

			int count = user.getLogin_count() + 1;
			userRepository.updateLoginCountByUserId(count, user.getUser_id());
			
			String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			userRepository.updateLastLoginByUserId(currentTime, user.getUser_id());
			
			map.put("data", userPrincipal);
			
			List<Item> listItems = itemsRepository.findItemByUserItemId(userPrincipal.getId());
			
			if(listItems !=null) {
				List<Item> items = itemsRepository.findItemByUserItemId(userPrincipal.getId());
				if(!items.isEmpty()) {
					map.put("menu", items);
				}
				
			}else {
				map.put("menu", new Menu());
			}
			
		}else {
			map.put("data", new User());
			map.put("menu", new Menu());
		}
		
		return ResponseEntity.ok(map);
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
		System.out.println("+--------signup--------+");

		User user = new User();
		user.setUser_id(signUpRequest.getUser_id());
		user.setFullname(signUpRequest.getFullname());
		user.setEmail(signUpRequest.getEmail());
		user.setUsername(signUpRequest.getUsername());
		user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
		user.setDepartment(signUpRequest.getDepartment());
		user.setIp_address(signUpRequest.getIp_address());
		user.setLogin_count(0);
		user.setLast_login(null);
		Role userRole = roleRepository.findByName(RoleName.ROLE_USER).orElseThrow(() -> new AppException("User Role not set."));
		user.setRoles(Collections.singleton(userRole));
		User sUser = userRepository.save(user);
		
		if(sUser != null) {
			//insert into a items table
			System.out.println("++++Insert Item++++");
			List<ListItems> listItems = signUpRequest.getItems();
			System.out.println(sUser);
			
			for (ListItems itm : listItems) {
				Item items = new Item();
				items.setName(itm.getName());
				items.setUser_id(sUser.getUser_id());
				items.setMenu_id(itm.getItem_id());
				items.setPrivilege(itm.getPrivilege());
				itemsRepository.save(items);
			}
		}else {
			throw new ResourceNotFoundException("Cannot insert Items with Userid : " + signUpRequest.getUser_id(), null, null);
		}

		return ResponseEntity.ok(signUpRequest);
	}
	
	@GetMapping("/findbyid/{user_id}")
	public ResponseEntity<?> getUserById(@PathVariable("user_id") Integer user_id) {
		User user = userRepository.findById(user_id).orElseThrow(() -> new ResourceNotFoundException("User", "id", user_id));
		return new ResponseEntity(user, HttpStatus.OK);
	}
	
	@PostMapping("/changepassword")
	public ResponseEntity<?> changePassword(@RequestBody ResetPassRequest resetPassRequest) {
		User user = userRepository.findById(resetPassRequest.getUser_id()).map(u -> {
			u.setPassword(passwordEncoder.encode(resetPassRequest.getPassword()));
			return userRepository.save(u);
		}).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + resetPassRequest.getUser_id(),
				null, null));

		return new ResponseEntity(user, HttpStatus.OK);
	}

	@GetMapping("fileWrite")
    public @ResponseBody void fileWrite(){
		String path = ".\\10.100.10.183\\Outbox\\email.txt";
		File file = new File(path);

		if (file.canRead() && file.canWrite() && file.isDirectory()) {
			FileWriter writer;
			try {
				writer = new FileWriter(file, true);
				writer.write("From=");
				writer.write("To=");
				writer.write("Cc=");
				writer.write("Bcc=");
				writer.write("Subject=Reset Password");
				writer.write("AttachFile=");
				writer.write("ท่านได้มีการ Reset Password โดย User:");
				writer.write("เมื่อวันที่ ...เวลา...");
				writer.write("Password ของท่านคือ");
				writer.close();
				
				System.out.println("Write success!");
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

    }

	
}
