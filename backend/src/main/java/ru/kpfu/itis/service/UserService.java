package ru.kpfu.itis.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.itis.dto.resp.BookResponse;
import ru.kpfu.itis.dto.resp.PageResponse;
import ru.kpfu.itis.dto.resp.PublicUserProfileResponse;
import ru.kpfu.itis.dto.resp.PublicUserResponse;
import ru.kpfu.itis.dto.resp.UserBookResponse;
import ru.kpfu.itis.entity.Book;
import ru.kpfu.itis.entity.UserAccount;
import ru.kpfu.itis.entity.UserBook;
import ru.kpfu.itis.repository.UserBookRepository;
import ru.kpfu.itis.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserBookRepository userBookRepository;

    @Transactional(readOnly = true)
    public PageResponse<PublicUserResponse> listUsers(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 30));
        var users = userRepository.findAllByOrderByCreatedAtDesc(pageable);
        return new PageResponse<>(
                users.getContent().stream().map(this::toPublicUser).toList(),
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public PublicUserProfileResponse getProfile(UUID id) {
        UserAccount user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return new PublicUserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                userBookRepository.findAllByUserIdOrderByUpdatedAtDesc(id).stream()
                        .map(this::toUserBookResponse)
                        .toList()
        );
    }

    private PublicUserResponse toPublicUser(UserAccount user) {
        return new PublicUserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                userBookRepository.countByUser(user)
        );
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
}
