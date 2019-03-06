package com.multibank.exception;

import java.sql.Timestamp;

public class APIException extends Exception {
	private String message;
	private int error;
	private int status;
	private String path;
	private Timestamp timestamp;

	public APIException(String message, int error, int status, String path, Timestamp timestamp) {
		super();
		this.message = message;
		this.error = error;
		this.status = status;
		this.path = path;
		this.timestamp = timestamp;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getError() {
		return error;
	}

	public void setError(int error) {
		this.error = error;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
}
