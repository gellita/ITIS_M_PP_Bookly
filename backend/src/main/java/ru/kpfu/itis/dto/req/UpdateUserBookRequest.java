package ru.kpfu.itis.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserBookRequest(
        @Schema(example = "4") @NotNull @Min(1) @Max(5) Integer userRating,
        @Schema(example = "Even better on reread.") @NotBlank String review
) {
}
