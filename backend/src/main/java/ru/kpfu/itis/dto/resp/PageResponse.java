package ru.kpfu.itis.dto.resp;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        @Schema(example = "0") int page,
        @Schema(example = "8") int size,
        @Schema(example = "10") long totalElements,
        @Schema(example = "2") int totalPages
) {
}
