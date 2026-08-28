package mz.gov.boaneconecta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BoaneConectaApplication {

	public static void main(String[] args) {
		SpringApplication.run(BoaneConectaApplication.class, args);
	}

}
