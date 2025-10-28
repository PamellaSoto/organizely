package organizely.app.task.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_tasks")
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name= "ID", length = 10)
  private Integer id;

  // TODO: atualizar para receber o id do usuario 
  //@JsonIgnore -> ver se precisa
  //@ManyToOne
  //@JoinColumn(name = "user_ID", nullable = false)
  @Column(name = "user_ID")
  private UUID userId;

  @Column(length = 70)
  private String description;

  // TODO: trocar para enum
  @Column(name = "day_of_week")
  private String dayOfWeek;

  @Column(name = "is_completed")
  private Boolean isCompleted;

  // TODO: trocar para enum
  private String priority;

  // TODO: atualizar para receber o id da categoria 
  //@JsonIgnore -> ver se precisa
  //@ManyToOne
  //@JoinColumn(name = "category_ID", nullable = true)
  private String categoryId;
}
