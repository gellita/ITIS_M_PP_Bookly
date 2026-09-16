package ru.kpfu.itis.dto.resp;

import io.swagger.v3.oas.annotations.media.Schema;

public record BookResponse(
        @Schema(example = "7") Long id,
        @Schema(example = "Dune") String title,
        @Schema(example = "Frank Herbert") String author,
        @Schema(example = "A sweeping science fiction epic about power and survival.") String description,
        @Schema(example = "4.6") double averageRating
) {
}
