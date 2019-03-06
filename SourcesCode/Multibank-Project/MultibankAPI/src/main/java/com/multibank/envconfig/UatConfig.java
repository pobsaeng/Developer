package com.multibank.envconfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("uat")
public class UatConfig implements BasedCofig {

	private static final Logger logger = LoggerFactory.getLogger(UatConfig.class);

	@Override
	public void setup() {
		logger.info("+[UAT config is setup..]");
//		System.out.println("UAT config is setup..");
	}
}
