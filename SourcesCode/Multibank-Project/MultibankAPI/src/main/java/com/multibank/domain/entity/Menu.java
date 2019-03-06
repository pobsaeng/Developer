package com.multibank.domain.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "menu")
public class Menu {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer menu_id;
	private String name;
	private String privilege;

	public Integer getMenu_id() {
		return menu_id;
	}

	public void setMenu_id(Integer treemenu_id) {
		this.menu_id = treemenu_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getPrivilege() {
		return privilege;
	}

	public void setPrivilege(String privilege) {
		this.privilege = privilege;
	}

	@Override
	public String toString() {
		return "Menu [menu_id=" + menu_id + ", name=" + name + ", privilege=" + privilege + "]";
	}

}
