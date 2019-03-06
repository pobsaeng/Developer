package com.multibank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import com.multibank.envconfig.BasedCofig;

@SpringBootApplication
public class BaseApplication extends SpringBootServletInitializer implements CommandLineRunner{

	@Autowired
	private BasedCofig envConfig;

	public static void main(String[] args) {
		SpringApplication.run(BaseApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(BaseApplication.class);
	}

	@Override
	public void run(String... args) throws Exception {
		envConfig.setup();
	}

}