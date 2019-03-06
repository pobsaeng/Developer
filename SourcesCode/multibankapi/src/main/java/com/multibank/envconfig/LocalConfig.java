package com.multibank.envconfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class LocalConfig implements BasedCofig {

	private static final Logger logger = LoggerFactory.getLogger(LocalConfig.class);

	@Override
	public void setup() {
		logger.info("+[Local configurations is setup..]");
		// System.out.println("Developer configurations is setup..");
	}

}
