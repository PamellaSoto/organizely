package organizely.app.task.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import organizely.app.task.entity.Task;

public interface ITaskRepository extends JpaRepository<Task, Integer> {

}
