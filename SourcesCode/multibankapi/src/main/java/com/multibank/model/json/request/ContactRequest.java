package com.multibank.model.json.request;

public class ContactRequest {
	private Integer contact_id;
	private String customer_name;
	private String mobile;
	private String email;
	public Integer getContact_id() {
		return contact_id;
	}
	public void setContact_id(Integer contact_id) {
		this.contact_id = contact_id;
	}
	public String getCustomer_name() {
		return customer_name;
	}
	public void setCustomer_name(String customer_name) {
		this.customer_name = customer_name;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	@Override
	public String toString() {
		return "ContactRequest [contact_id=" + contact_id + ", customer_name=" + customer_name + ", mobile=" + mobile
				+ ", email=" + email + "]";
	}
}
