package com.multibank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.multibank.domain.entity.Item;

@Repository
public interface ItemsRepository extends JpaRepository<Item, Integer>{
	@Transactional
	@Query(value = "SELECT itm FROM Item itm WHERE itm.user_id=:user_id")
	List<Item> findItemByUserItemId(@Param("user_id") Integer user_id);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE item SET name = ? WHERE user_id = ?", nativeQuery = true)
	int updateItemByUserItemId(String name, Integer user_id);

//	@Transactional
//	@Modifying
//	@Query("update Items i set i.name =:name where i.item_id =:item_id")
//	void updateItems(@Param("name") String name, @Param("item_id") Integer item_id);

	@Transactional
	@Modifying
	@Query(value = "DELETE FROM item WHERE user_id = ?", nativeQuery = true)
	int deleteByUserItemId(Integer user_id);

}
