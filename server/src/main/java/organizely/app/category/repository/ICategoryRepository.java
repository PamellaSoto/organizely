package organizely.app.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import organizely.app.category.entity.Category;

public interface ICategoryRepository extends JpaRepository<Category, Integer> {

}
