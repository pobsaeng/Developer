package com.multibank.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.multibank.domain.entity.Item;
import com.multibank.domain.entity.User;
import com.multibank.repository.ItemsRepository;
import com.multibank.repository.RoleRepository;
import com.multibank.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	UserRepository userRepository;
	@Autowired
	ItemsRepository itemsRepository;
	@Autowired
	RoleRepository roleRepository;

	public Map<String, Object> findByUserId(Integer userId) {
		Map<String, Object> mResult = new HashMap<>();
		Map<String, Object> map = new HashMap<>();

		if (userId == null) {
			List<Item> listItems = itemsRepository.findItemByUserItemId(userId);
		}
		
		mResult.put("results", map);
		return mResult;
	}
}
