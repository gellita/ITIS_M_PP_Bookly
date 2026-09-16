package ru.kpfu.itis.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.dto.resp.PageResponse;
import ru.kpfu.itis.dto.resp.PublicUserProfileResponse;
import ru.kpfu.itis.dto.resp.PublicUserResponse;
import ru.kpfu.itis.service.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Public users", description = "Public reader directory and public bookshelf profiles")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "List readers", description = "Returns a paginated list of registered Bookly users.")
    @ApiResponse(responseCode = "200", description = "Reader page returned")
    public PageResponse<PublicUserResponse> users(
            @Parameter(description = "Zero-based page number", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size, capped at 30", example = "8") @RequestParam(defaultValue = "8") int size
    ) {
        return userService.listUsers(page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reader profile", description = "Returns a public profile with the reader's books, ratings, and reviews.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reader profile returned"),
            @ApiResponse(responseCode = "404", description = "Reader not found")
    })
    public PublicUserProfileResponse profile(
            @Parameter(description = "User UUID", example = "550e8400-e29b-41d4-a716-446655440000") @PathVariable UUID id
    ) {
        return userService.getProfile(id);
    }
}
