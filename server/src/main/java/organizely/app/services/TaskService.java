package organizely.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import organizely.app.dto.TaskUpdateDTO;
import organizely.app.entity.Category;
import organizely.app.entity.Task;
import organizely.app.repository.ITaskRepository;

@Service
public class TaskService {

  @Autowired
  public ITaskRepository taskRepository;
  
  @Autowired
  private CategoryService categoryService;
  
  // fetch task
  public Task fetchTask(Integer taskId) {
    var taskResult = this.taskRepository.findById(taskId);
    if (taskResult.isEmpty()) {
      return null;
    }
    Task existingTask = taskResult.get();
    return existingTask;
  }

  // update task
  public void updateTask(TaskUpdateDTO dto, Task existingTask) {
    if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
      existingTask.setDescription(dto.getDescription());
    }

    if (dto.getIsCompleted() != null) {
      existingTask.setIsCompleted(dto.getIsCompleted());
    }

    if (dto.getDayOfWeek() != null) {
      existingTask.setDayOfWeek(dto.getDayOfWeek());
    }

    if (dto.getPriority() != null) {
      existingTask.setPriority(dto.getPriority());
    }

    if (dto.getCategory() != null) {
      Category category = categoryService.fetchCategory(dto.getCategory());
      existingTask.setCategory(category);
    }

    this.taskRepository.save(existingTask);
  }


}