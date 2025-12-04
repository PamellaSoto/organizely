package organizely.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import organizely.app.entity.Category;

public interface ICategoryRepository extends JpaRepository<Category, Integer> {

}
