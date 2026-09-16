package ru.kpfu.itis.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Schema(example = "alice") @NotBlank String usernameOrEmail,
        @Schema(example = "password") @NotBlank String password
) {
}
