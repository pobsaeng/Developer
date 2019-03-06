package com.multibank.map.propertie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:apiconstant.properties")
public class APIConstant {
	
	@Value(value="constant.text.success")
	public String SUCCESS;
	
	@Value(value="constant.text.data")
	public String DATA;
	
	@Value(value="constant.text.message")
	public String MESSAGE;
}
