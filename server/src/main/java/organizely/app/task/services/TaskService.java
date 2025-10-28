package organizely.app.task.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import organizely.app.task.entity.Task;
import organizely.app.task.repository.ITaskRepository;

@Service
public class TaskService {

  @Autowired
  public ITaskRepository taskRepository;
  
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
  public void updateTask(Task updatedTask, Task existingTask) {

    if (updatedTask.getDescription() != null && !updatedTask.getDescription().isBlank()) {
      existingTask.setDescription(updatedTask.getDescription());
    }

    if (updatedTask.getDayOfWeek() != null) {
      existingTask.setDayOfWeek(updatedTask.getDayOfWeek());
    }

    if (updatedTask.getPriority() != null) {
      existingTask.setPriority(updatedTask.getPriority());
    }

    if (updatedTask.getCategoryId() != null) {
      existingTask.setCategoryId(updatedTask.getCategoryId());
    }

    this.taskRepository.save(existingTask);
  }


}