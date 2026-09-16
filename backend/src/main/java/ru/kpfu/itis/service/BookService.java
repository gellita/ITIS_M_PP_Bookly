package ru.kpfu.itis.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.itis.dto.resp.BookResponse;
import ru.kpfu.itis.dto.req.CreateBookRequest;
import ru.kpfu.itis.dto.req.CreateUserBookRequest;
import ru.kpfu.itis.dto.req.UpdateUserBookRequest;
import ru.kpfu.itis.dto.resp.UserBookResponse;
import ru.kpfu.itis.entity.Book;
import ru.kpfu.itis.entity.UserAccount;
import ru.kpfu.itis.entity.UserBook;
import ru.kpfu.itis.repository.BookRepository;
import ru.kpfu.itis.repository.UserBookRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserBookRepository userBookRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> listBooks() {
        return bookRepository.findAll().stream()
                .map(this::toBookResponse)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Book book = new Book();
        book.setTitle(request.title().trim());
        book.setAuthor(request.author().trim());
        book.setDescription(request.description().trim());
        return toBookResponse(bookRepository.save(book));
    }

    @Transactional(readOnly = true)
    public List<UserBookResponse> listMyBooks(UserAccount user) {
        return userBookRepository.findAllByUserOrderByUpdatedAtDesc(user).stream()
                .map(this::toUserBookResponse)
                .toList();
    }

    @Transactional
    public UserBookResponse addToShelf(UserAccount user, CreateUserBookRequest request) {
        Book book = request.bookId() == null ? createBookFromShelfRequest(request) : findBook(request.bookId());
        if (userBookRepository.existsByUserAndBook(user, book)) {
            throw new IllegalArgumentException("Book is already on your shelf");
        }

        UserBook userBook = new UserBook();
        userBook.setUser(user);
        userBook.setBook(book);
        userBook.setUserRating(request.userRating());
        userBook.setReview(request.review().trim());
        return toUserBookResponse(userBookRepository.save(userBook));
    }

    @Transactional
    public UserBookResponse updateShelfBook(UserAccount user, Long shelfBookId, UpdateUserBookRequest request) {
        UserBook userBook = userBookRepository.findByIdAndUser(shelfBookId, user)
                .orElseThrow(() -> new EntityNotFoundException("Shelf book not found"));
        userBook.setUserRating(request.userRating());
        userBook.setReview(request.review().trim());
        userBook.touch();
        return toUserBookResponse(userBook);
    }

    @Transactional
    public void deleteShelfBook(UserAccount user, Long shelfBookId) {
        UserBook userBook = userBookRepository.findByIdAndUser(shelfBookId, user)
                .orElseThrow(() -> new EntityNotFoundException("Shelf book not found"));
        userBookRepository.delete(userBook);
    }

    private Book createBookFromShelfRequest(CreateUserBookRequest request) {
        if (isBlank(request.title()) || isBlank(request.author()) || isBlank(request.description())) {
            throw new IllegalArgumentException("Title, author and description are required for a new book");
        }

        Book book = new Book();
        book.setTitle(request.title().trim());
        book.setAuthor(request.author().trim());
        book.setDescription(request.description().trim());
        return bookRepository.save(book);
    }

    private Book findBook(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Book not found"));
    }

    private UserBookResponse toUserBookResponse(UserBook userBook) {
        return new UserBookResponse(
                userBook.getId(),
                toBookResponse(userBook.getBook()),
                userBook.getUserRating(),
                userBook.getReview()
        );
    }

    private BookResponse toBookResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDescription(),
                Math.round(userBookRepository.averageRatingFor(book) * 10.0) / 10.0
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
