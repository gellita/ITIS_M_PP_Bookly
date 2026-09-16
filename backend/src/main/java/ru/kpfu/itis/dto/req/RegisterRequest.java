package ru.kpfu.itis.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Schema(example = "jane") @NotBlank @Size(min = 3, max = 64) String username,
        @Schema(example = "jane@bookly.local") @NotBlank @Email @Size(max = 160) String email,
        @Schema(example = "password") @NotBlank @Size(min = 6, max = 120) String password,
        @Schema(example = "Jane Reader") @NotBlank @Size(max = 120) String displayName
) {
}
