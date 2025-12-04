package organizely.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import organizely.app.entity.Task;

public interface ITaskRepository extends JpaRepository<Task, Integer> {

}
