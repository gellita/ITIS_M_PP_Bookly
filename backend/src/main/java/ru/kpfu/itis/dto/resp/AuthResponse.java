package ru.kpfu.itis.dto.resp;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthResponse(
        @Schema(description = "Opaque bearer token", example = "a9f2...") String token,
        UserResponse user
) {
}
