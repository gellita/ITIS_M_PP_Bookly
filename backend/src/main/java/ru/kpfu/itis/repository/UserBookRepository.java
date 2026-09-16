package ru.kpfu.itis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kpfu.itis.entity.Book;
import ru.kpfu.itis.entity.UserAccount;
import ru.kpfu.itis.entity.UserBook;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserBookRepository extends JpaRepository<UserBook, Long> {
    List<UserBook> findAllByUserOrderByUpdatedAtDesc(UserAccount user);

    List<UserBook> findAllByUserIdOrderByUpdatedAtDesc(UUID userId);

    Optional<UserBook> findByIdAndUser(Long id, UserAccount user);

    boolean existsByUserAndBook(UserAccount user, Book book);

    long countByUser(UserAccount user);

    @Query("select coalesce(avg(ub.userRating), 0) from UserBook ub where ub.book = :book")
    double averageRatingFor(Book book);
}
