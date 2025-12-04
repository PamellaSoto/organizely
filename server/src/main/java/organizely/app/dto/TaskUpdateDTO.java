package organizely.app.dto;

import organizely.app.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDTO {
  private String description;
  private Boolean isCompleted;
  private String dayOfWeek;
  private Priority priority;
  private Integer category;
}
