package organizely.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import organizely.app.entity.Category;
import organizely.app.repository.ICategoryRepository;

@Service
public class CategoryService {

  @Autowired
  public ICategoryRepository categoryRepository;
  
  // fetch category
  public Category fetchCategory(Integer categoryId) {
    var categoryResult = categoryRepository.findById(categoryId);
    if (categoryResult.isEmpty()) {
      return null;
    }
    return categoryResult.get();
  }

  // update category
  public void updateCategory(Category updatedCategory, Category existingCategory) {
    if (updatedCategory.getName() != null && !updatedCategory.getName().isBlank()) {
      existingCategory.setName(updatedCategory.getName());
    }

    this.categoryRepository.save(existingCategory);
  }

}