package ru.kpfu.itis.config;

import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {
    @Bean
    FlywayConfigurationCustomizer flywayConfigurationCustomizer() {
        return (FluentConfiguration configuration) -> configuration
                .baselineOnMigrate(true)
                .validateMigrationNaming(true);
    }

    @Bean
    FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }
}
