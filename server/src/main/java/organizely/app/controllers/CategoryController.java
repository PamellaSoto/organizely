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

import organizely.app.entity.Category;
import organizely.app.repository.ICategoryRepository;
import organizely.app.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  @Autowired
  public CategoryService categoryService;

  @Autowired
  public ICategoryRepository categoryRepository;

  // create a new category
  @PostMapping("/new")
  public ResponseEntity<Object> createCategory(@RequestBody Category category) {
    this.categoryRepository.save(category);
    return ResponseEntity.status(HttpStatus.OK)
                         .body("Category created.");
  }

  //list all categories 
  @GetMapping("/all")
  public ResponseEntity<Object> listAllCategories() {
    var categories = this.categoryRepository.findAll();
    return ResponseEntity.status(HttpStatus.OK).body(categories);
  }

  // update category
  @PutMapping("/{id}/edit")
  public ResponseEntity<Object> updateCategory(@PathVariable("id") Integer categoryId, @RequestBody Category category) {
    var existingCategory = this.categoryService.fetchCategory(categoryId);
    if (existingCategory == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("Category not found.");
    }
    this.categoryService.updateCategory(category, existingCategory);
    return ResponseEntity.status(HttpStatus.OK)
                                .body("Category updated.");
  }

  // delete category
  @DeleteMapping("/{id}/delete")
  public ResponseEntity<Object> deleteCategory(@PathVariable("id") Integer categoryId) {
    var existingCategory = this.categoryService.fetchCategory(categoryId);
    if (existingCategory == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("Category not found.");
    }
    this.categoryRepository.deleteById(categoryId);
    return ResponseEntity.status(HttpStatus.OK)
                                .body("Category deleted.");
  }
}