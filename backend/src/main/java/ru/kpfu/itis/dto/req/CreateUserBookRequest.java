package ru.kpfu.itis.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserBookRequest(
        @Schema(description = "Existing catalog book id. Leave empty when creating a new book.", example = "7") Long bookId,
        @Schema(description = "Required only for a new book", example = "Tomorrow, and Tomorrow, and Tomorrow") @Size(max = 240) String title,
        @Schema(description = "Required only for a new book", example = "Gabrielle Zevin") @Size(max = 180) String author,
        @Schema(description = "Required only for a new book", example = "A novel about friendship, games, ambition, and art.") String description,
        @Schema(example = "5") @NotNull @Min(1) @Max(5) Integer userRating,
        @Schema(example = "Smart, warm, and very readable.") @NotBlank String review
) {
}
