package com.nil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = { org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class })
public class MockInterviewProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(MockInterviewProjectApplication.class, args);
    }
} 