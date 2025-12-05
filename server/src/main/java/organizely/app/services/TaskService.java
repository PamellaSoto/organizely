package organizely.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import organizely.app.dto.TaskUpdateDTO;
import organizely.app.entity.Category;
import organizely.app.entity.Priority;
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
    return taskResult.get();
  }

  private Priority convertIntegerToPriority(Integer value) {
    for (Priority p : Priority.values()) {
      if (p.getValue().equals(value)) {
        return p;
      }
    }
    return Priority.NONE;
  }

  // update task
  public void updateTask(TaskUpdateDTO dto, Task existingTask) {
    if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
      existingTask.setDescription(dto.getDescription());
    }

    if (dto.getIsCompleted() != null) {
      existingTask.setIsCompleted(dto.getIsCompleted());
    }

    if (dto.getIsArchived() != null) {
      existingTask.setIsArchived(dto.getIsArchived());
    }

    if (dto.getDayOfWeek() != null) {
      existingTask.setDayOfWeek(dto.getDayOfWeek());
    }

    if (dto.getPriority() != null) {
      Priority convertedPriority = convertIntegerToPriority(dto.getPriority());
      existingTask.setPriority(convertedPriority);
    }

    if (dto.getCategory() != null) {
      Category category = categoryService.fetchCategory(dto.getCategory());
      existingTask.setCategory(category);
    } else {
      existingTask.setCategory(null);
    }

    this.taskRepository.save(existingTask);
  }

  // archive task
  public void archiveTask(Integer taskId) {
    var taskResult = this.taskRepository.findById(taskId);
    if (taskResult.isEmpty()) {
      return;
    }
    Task task = taskResult.get();
    task.setIsArchived(true);
    task.setIsCompleted(true);
    this.taskRepository.save(task);
  }
}