package com.multibank.baseconfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcCors implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedMethods("GET", "PUT", "POST", "GET", "OPTIONS");

//		registry.addMapping("/api/**").allowedOrigins("*").allowedMethods()
//				.allowedMethods("GET", "PUT", "POST", "GET", "OPTIONS").allowedHeaders("Content-Type", "Authorization")
//				.exposedHeaders("Content-Type", "Authorization").allowCredentials(false).maxAge(3600);
	}
}
