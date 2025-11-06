package com.example.project1.repository;

import com.example.project1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // Allow lookup by username OR email to support users who sign in with either identifier.
    Optional<User> findByUsernameOrEmail(String username, String email);
}
