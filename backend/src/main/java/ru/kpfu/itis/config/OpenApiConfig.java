package ru.kpfu.itis.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI booklyOpenApi() {
        String bearerAuth = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Bookly API")
                        .version("1.0.0")
                        .description("Simple book shelf service API"))
                .schemaRequirement(bearerAuth, new SecurityScheme()
                        .name(bearerAuth)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer"))
                .addSecurityItem(new SecurityRequirement().addList(bearerAuth));
    }
}
