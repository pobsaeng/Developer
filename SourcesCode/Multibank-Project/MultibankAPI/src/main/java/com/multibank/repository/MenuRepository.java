package com.multibank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.multibank.domain.entity.Menu;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer>{

}
