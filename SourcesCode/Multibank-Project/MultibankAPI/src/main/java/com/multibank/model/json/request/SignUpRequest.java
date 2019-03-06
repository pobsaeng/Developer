package com.multibank.model.json.request;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

public class SignUpRequest {
	private Integer user_id;
	private String fullname;
	private String username;
	private String email;
	private String password;
	private String department;
	private String ip_address;
	private String login_count;
	private String last_login;
	
	private String privilege;
	
	private List<ListItems> items = new ArrayList<ListItems>();
	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}

	public String getFullname() {
		return fullname;
	}
	public void setFullname(String fullname) {
		this.fullname = fullname;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public List<ListItems> getItems() {
		return items;
	}
	public void setItems(List<ListItems> items) {
		this.items = items;
	}
	public String getPrivilege() {
		return privilege;
	}
	public void setPrivilege(String privilege) {
		this.privilege = privilege;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getIp_address() {
		return ip_address;
	}
	public void setIp_address(String ip_address) {
		this.ip_address = ip_address;
	}

	public String getLogin_count() {
		return login_count;
	}
	public void setLogin_count(String login_count) {
		this.login_count = login_count;
	}
	
	public String getLast_login() {
		return last_login;
	}
	public void setLast_login(String last_login) {
		this.last_login = last_login;
	}
	@Override
	public String toString() {
		return "SignUpRequest [user_id=" + user_id + ", fullname=" + fullname + ", username=" + username + ", email="
				+ email + ", password=" + password + ", department=" + department + ", ip_address=" + ip_address
				+ ", login_count=" + login_count + ", last_login=" + last_login + ", privilege=" + privilege
				+ ", items=" + items + "]";
	}
	
}
