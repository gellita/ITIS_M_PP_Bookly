package ru.kpfu.itis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
}
