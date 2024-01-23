package com.example.filmfoliobackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.concurrent.DelegatingSecurityContextExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    @Override
    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Minimalna liczba wątków
        executor.setMaxPoolSize(5);  // Maksymalna liczba wątków
        executor.setQueueCapacity(100); // Rozmiar kolejki
        executor.setThreadNamePrefix("MovieThread-");
        executor.initialize();
        return new DelegatingSecurityContextExecutor(executor);
    }
}
