package com.multibank.model.json.response;

public class JwtAuthenResponse {
	private String accessToken;

	public JwtAuthenResponse(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
}
