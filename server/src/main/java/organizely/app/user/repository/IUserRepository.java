package organizely.app.user.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import organizely.app.user.entity.User;

public interface IUserRepository extends JpaRepository<User, UUID> {
  List<User> findByUsername(String username);
}
