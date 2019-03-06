package com.multibank.envconfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("prod")
public class ProdConfig implements BasedCofig {

	private static final Logger logger = LoggerFactory.getLogger(ProdConfig.class);

	@Override
	public void setup() {
		logger.info("+[Production configurations is setup..]");
		System.out.println("Production configurations is setup..");
	}
}
