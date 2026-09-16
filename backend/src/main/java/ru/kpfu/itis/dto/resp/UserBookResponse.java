package ru.kpfu.itis.dto.resp;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserBookResponse(
        @Schema(example = "12") Long id,
        BookResponse book,
        @Schema(example = "5") Integer userRating,
        @Schema(example = "A warm and memorable read.") String review
) {
}
