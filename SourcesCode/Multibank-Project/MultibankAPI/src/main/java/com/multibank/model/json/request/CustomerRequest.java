package com.multibank.model.json.request;

public class CustomerRequest {
	private Integer customerID;
	private String accountNumber;
	private String accountName;
	private String accountBranch;
	private String referenceNumber1;
	private String downloadTime;
	private String clientCode;
	private String referenceNumber2;
	public Integer getCustomerID() {
		return customerID;
	}
	public void setCustomerID(Integer customerID) {
		this.customerID = customerID;
	}
	public String getAccountNumber() {
		return accountNumber;
	}
	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public String getAccountBranch() {
		return accountBranch;
	}
	public void setAccountBranch(String accountBranch) {
		this.accountBranch = accountBranch;
	}
	public String getReferenceNumber1() {
		return referenceNumber1;
	}
	public void setReferenceNumber1(String referenceNumber1) {
		this.referenceNumber1 = referenceNumber1;
	}
	public String getDownloadTime() {
		return downloadTime;
	}
	public void setDownloadTime(String downloadTime) {
		this.downloadTime = downloadTime;
	}
	public String getClientCode() {
		return clientCode;
	}
	public void setClientCode(String clientCode) {
		this.clientCode = clientCode;
	}
	public String getReferenceNumber2() {
		return referenceNumber2;
	}
	public void setReferenceNumber2(String referenceNumber2) {
		this.referenceNumber2 = referenceNumber2;
	}
	@Override
	public String toString() {
		return "CustomerRequest [customerID=" + customerID + ", accountNumber=" + accountNumber + ", accountName="
				+ accountName + ", accountBranch=" + accountBranch + ", referenceNumber1=" + referenceNumber1
				+ ", downloadTime=" + downloadTime + ", clientCode=" + clientCode + ", referenceNumber2="
				+ referenceNumber2 + "]";
	}
	
	
}
