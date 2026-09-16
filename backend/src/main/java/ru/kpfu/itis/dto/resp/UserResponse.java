package ru.kpfu.itis.dto.resp;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record UserResponse(
        @Schema(example = "550e8400-e29b-41d4-a716-446655440000") UUID id,
        @Schema(example = "alice") String username,
        @Schema(example = "alice@bookly.local") String email,
        @Schema(example = "Alice Morgan") String displayName
) {
}
