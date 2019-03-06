package com.multibank.domain.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "customer_id")
	private Integer customerID;
	@Column(name = "account_number")
	private String accountNumber;
	@Column(name = "account_name")
	private String accountName;
	@Column(name = "account_branch")
	private String accountBranch;
	@Column(name = "reference_number1")
	private String referenceNumber1;
	@Column(name = "download_time")
	private String downloadTime;
	@Column(name = "client_code")
	private String clientCode;
	@Column(name = "reference_number2")
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
		return "Customer [customerID=" + customerID + ", accountNumber=" + accountNumber + ", accountName="
				+ accountName + ", accountBranch=" + accountBranch + ", referenceNumber1=" + referenceNumber1
				+ ", downloadTime=" + downloadTime + ", clientCode=" + clientCode + ", referenceNumber2="
				+ referenceNumber2 + "]";
	}

}
