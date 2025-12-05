package organizely.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDTO {
  private String description;
  private Boolean isCompleted;
  private Boolean isArchived;
  private String dayOfWeek;
  private Integer priority;
  private Integer category;
}
