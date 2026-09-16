package ru.kpfu.itis.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.dto.resp.BookResponse;
import ru.kpfu.itis.dto.req.CreateBookRequest;
import ru.kpfu.itis.dto.req.CreateUserBookRequest;
import ru.kpfu.itis.dto.req.UpdateUserBookRequest;
import ru.kpfu.itis.dto.resp.UserBookResponse;
import ru.kpfu.itis.entity.UserAccount;
import ru.kpfu.itis.service.BookService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Books and shelf", description = "Shared book catalog and authenticated user's personal shelf")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/books")
    @Operation(summary = "List catalog books", description = "Returns all books available in the shared Bookly catalog.")
    @ApiResponse(responseCode = "200", description = "Catalog returned")
    public List<BookResponse> books() {
        return bookService.listBooks();
    }

    @PostMapping("/books")
    @Operation(summary = "Create catalog book", description = "Creates a new shared catalog book.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book created"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid bearer token")
    })
    public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
        return bookService.createBook(request);
    }

    @GetMapping("/my/books")
    @Operation(summary = "List my shelf", description = "Returns books added to the authenticated user's shelf.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shelf returned"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid bearer token")
    })
    public List<UserBookResponse> myBooks(@AuthenticationPrincipal UserAccount user) {
        return bookService.listMyBooks(user);
    }

    @PostMapping("/my/books")
    @Operation(summary = "Add book to my shelf", description = "Adds an existing catalog book or creates a new book and adds it to the user's shelf.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book added to shelf"),
            @ApiResponse(responseCode = "400", description = "Validation error or duplicate shelf item"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid bearer token"),
            @ApiResponse(responseCode = "404", description = "Catalog book not found")
    })
    public UserBookResponse addToShelf(
            @AuthenticationPrincipal UserAccount user,
            @Valid @RequestBody CreateUserBookRequest request
    ) {
        return bookService.addToShelf(user, request);
    }

    @PutMapping("/my/books/{id}")
    @Operation(summary = "Update shelf book", description = "Updates rating and review for a book on the authenticated user's shelf.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shelf book updated"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid bearer token"),
            @ApiResponse(responseCode = "404", description = "Shelf book not found")
    })
    public UserBookResponse updateShelfBook(
            @AuthenticationPrincipal UserAccount user,
            @Parameter(description = "Shelf item id", example = "12") @PathVariable Long id,
            @Valid @RequestBody UpdateUserBookRequest request
    ) {
        return bookService.updateShelfBook(user, id, request);
    }

    @DeleteMapping("/my/books/{id}")
    @Operation(summary = "Delete shelf book", description = "Removes a book from the authenticated user's shelf.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Shelf book deleted"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid bearer token"),
            @ApiResponse(responseCode = "404", description = "Shelf book not found")
    })
    public Map<String, Boolean> deleteShelfBook(
            @AuthenticationPrincipal UserAccount user,
            @Parameter(description = "Shelf item id", example = "12") @PathVariable Long id
    ) {
        bookService.deleteShelfBook(user, id);
        return Map.of("ok", true);
    }
}
