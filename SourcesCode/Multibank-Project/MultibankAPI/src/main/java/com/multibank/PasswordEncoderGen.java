package com.multibank;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderGen {

	public static void main(String[] args) {
		// spring 4.0.0
		PasswordEncoder encoder = new BCryptPasswordEncoder();
		String passwd = encoder.encode("123456");
		System.out.println(passwd);

		//Checking password is match
		System.out.println(encoder.matches("123456", passwd));
	}
}