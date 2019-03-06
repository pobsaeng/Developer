package com.multibank.model.json.request;

public class ListItems {
	private Integer item_id;
	private String name;
	private String user_item_id;
	private Integer menu_id;
	private String privilege;
	public Integer getItem_id() {
		return item_id;
	}
	public void setItem_id(Integer item_id) {
		this.item_id = item_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUser_item_id() {
		return user_item_id;
	}
	public void setUser_item_id(String user_item_id) {
		this.user_item_id = user_item_id;
	}
	public Integer getMenu_id() {
		return menu_id;
	}
	public void setMenu_id(Integer menu_id) {
		this.menu_id = menu_id;
	}
	public String getPrivilege() {
		return privilege;
	}
	public void setPrivilege(String privilege) {
		this.privilege = privilege;
	}
	@Override
	public String toString() {
		return "ListItems [item_id=" + item_id + ", name=" + name + ", user_item_id=" + user_item_id + ", menu_id="
				+ menu_id + ", privilege=" + privilege + "]";
	}
}
