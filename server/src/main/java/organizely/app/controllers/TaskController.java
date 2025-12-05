package organizely.app.controllers;

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

import organizely.app.dto.TaskUpdateDTO;
import organizely.app.entity.Task;
import organizely.app.repository.ITaskRepository;
import organizely.app.services.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  @Autowired
  public TaskService taskService;

  @Autowired
  public ITaskRepository taskRepository;

  // create a new task
  @PostMapping("/new")
  public ResponseEntity<Task> createTask(@RequestBody Task task) {
    Task savedTask = this.taskRepository.save(task);
    return ResponseEntity.status(HttpStatus.CREATED)
                         .body(savedTask);
  }

  // list all tasks 
  @GetMapping("/all")
  public ResponseEntity<Object> listAllTasks() {
    var tasks = this.taskRepository.findAll();
    return ResponseEntity.status(HttpStatus.OK).body(tasks);
  }

  // update task
  @PutMapping("/{id}/edit")
  public ResponseEntity<Task> updateTask(@PathVariable("id") Integer taskId, @RequestBody TaskUpdateDTO dto) {
    var existingTask = this.taskService.fetchTask(taskId);
    if (existingTask == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    
    this.taskService.updateTask(dto, existingTask);
    
    return ResponseEntity.ok(existingTask);
  }

  // delete task
  @DeleteMapping("/{id}/delete")
  public ResponseEntity<Object> deleteTask(@PathVariable("id") Integer taskId) {
    var existingTask = this.taskService.fetchTask(taskId);
    if (existingTask == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
                           .body("Task not found.");
    }
    this.taskRepository.deleteById(taskId);
    return ResponseEntity.status(HttpStatus.OK)
                                .body("Task deleted.");
  }

  // archive task
  @PutMapping("/{id}/archive")
  public ResponseEntity<Task> archiveTask(@PathVariable("id") Integer taskId) {
    var existingTask = this.taskService.fetchTask(taskId);
    if (existingTask == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    this.taskService.archiveTask(taskId);
    var updated = this.taskService.fetchTask(taskId);

    return ResponseEntity.ok(updated);
  }
}