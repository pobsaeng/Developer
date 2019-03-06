package com.multibank.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.multibank.domain.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	@Transactional
	@Query(value = "SELECT * FROM users ORDER BY user_id", nativeQuery = true)
	List<User> findAllUsers();
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE users SET password = ? WHERE user_id = ?", nativeQuery = true)
	int updatePasswordByUserId(String password, Integer user_id);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE users SET last_login=? WHERE user_id=?", nativeQuery = true)
	int updateLastLoginByUserId(String last_login, Integer user_id);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE users SET login_count=? WHERE user_id=?", nativeQuery = true)
	int updateLoginCountByUserId(Integer login_count, Integer user_id);
	
	Optional<User> findByEmail(String email);

	Optional<User> findByUsernameOrEmail(String username, String email);	

	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);
}
