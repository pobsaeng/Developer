package com.multibank.model.json.request;

public class BankChequeRequest {
	private Integer bank_id;
	private String user;
	private String password;
	private String other;
	private String minimum_balance;
	private String cut_balance;
	private String signature;
	private String itemsRound;
	private String itemsBankCheque;
	
	public Integer getBank_id() {
		return bank_id;
	}
	public void setBank_id(Integer bank_id) {
		this.bank_id = bank_id;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getOther() {
		return other;
	}
	public void setOther(String other) {
		this.other = other;
	}
	public String getMinimum_balance() {
		return minimum_balance;
	}
	public void setMinimum_balance(String minimum_balance) {
		this.minimum_balance = minimum_balance;
	}
	public String getCut_balance() {
		return cut_balance;
	}
	public void setCut_balance(String cut_balance) {
		this.cut_balance = cut_balance;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
	public String getItemsRound() {
		return itemsRound;
	}
	public void setItemsRound(String itemsRound) {
		this.itemsRound = itemsRound;
	}
	public String getItemsBankCheque() {
		return itemsBankCheque;
	}
	public void setItemsBankCheque(String itemsBankCheque) {
		this.itemsBankCheque = itemsBankCheque;
	}
	@Override
	public String toString() {
		return "BankCheque [bank_id=" + bank_id + ", user=" + user + ", password=" + password + ", other=" + other
				+ ", minimum_balance=" + minimum_balance + ", cut_balance=" + cut_balance + ", signature=" + signature
				+ ", itemsRound=" + itemsRound + ", itemsBankCheque=" + itemsBankCheque + "]";
	}
	
}
