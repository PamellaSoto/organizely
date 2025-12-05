package organizely.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_tasks")
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Integer id;

  @Column(name = "description", length = 70, nullable = false)
  private String description;

  @Column(name = "is_completed", nullable = false)
  private Boolean isCompleted;

  @Column(name = "is_archived", nullable = false)
  private Boolean isArchived;
  
  @Column(name = "priority", nullable = false)
  private Priority priority;

  @ManyToOne
  @JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "fk_task_category"))
  private Category category;

  @Column(name = "day_of_week", length = 20, nullable = false)
  private String dayOfWeek;

  @PrePersist
  public void prePersist() {
    if (this.isCompleted == null) {
      this.isCompleted = false;
    }
    if (this.isArchived == null) {
      this.isArchived = false;
    }
    if (this.priority == null) {
      this.priority = Priority.NONE;
    }
    if (this.dayOfWeek == null || this.dayOfWeek.isEmpty()) {
      this.dayOfWeek = "backlog";
    }
  }
}
