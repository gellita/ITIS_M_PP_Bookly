package ru.kpfu.itis.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateBookRequest(
        @Schema(example = "Dune") @NotBlank @Size(max = 240) String title,
        @Schema(example = "Frank Herbert") @NotBlank @Size(max = 180) String author,
        @Schema(example = "A sweeping science fiction epic about power and survival.") @NotBlank String description
) {
}
