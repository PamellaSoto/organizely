package organizely.app.user.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_users")
public class User {
  @Id
  @GeneratedValue(strategy=GenerationType.UUID)
  private UUID id;

  @Column(length = 100)
  private String fullName;

  @Column(unique = true, length = 50)
  private String username;

  private String password;

  @CreationTimestamp
  private LocalDateTime createdAt;
}
