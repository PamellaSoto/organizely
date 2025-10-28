package organizely.app.task.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import organizely.app.task.entity.Task;
import organizely.app.task.repository.ITaskRepository;
import organizely.app.task.services.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  @Autowired
  public TaskService taskService;

  @Autowired
  public ITaskRepository taskRepository;

  // create a new task
  @PostMapping
  public ResponseEntity<Object> createTask(@RequestBody Task task) {
    this.taskRepository.save(task);
    return ResponseEntity.status(HttpStatus.OK)
                         .body("Task registered.");
  }

  // (by user uuid) list all tasks 
  @GetMapping
  public ResponseEntity<Object> listAllTasks() {
    var tasks = this.taskRepository.findAll();
    return ResponseEntity.status(HttpStatus.OK).body(tasks);
  }

  // update task
  @PutMapping("/{id}/edit")
  public ResponseEntity<Object> updateTask(@PathVariable("id") Integer taskId, @RequestBody Task task) {
    var existingTask = this.taskService.fetchTask(taskId);
    if (existingTask == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("Task not found.");
    }
    this.taskService.updateTask(task, existingTask);
    return ResponseEntity.status(HttpStatus.OK)
                                .body("Task updated.");
  }

  // delete task
  @DeleteMapping("/{id}/delete")
  public ResponseEntity<Object> deleteTask(@PathVariable("id") Integer taskId) {
    var existingTask = this.taskService.fetchTask(taskId);
    if (existingTask == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("Task not found.");
    }
    this.taskRepository.deleteById(taskId);
    return ResponseEntity.status(HttpStatus.OK)
                                .body("Task deleted.");
  }

  // TODO: remove category from task (leaving it empty)

  // TODO: set task to completed
}