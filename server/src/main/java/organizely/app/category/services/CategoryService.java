package organizely.app.category.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import organizely.app.category.entity.Category;
import organizely.app.category.repository.ICategoryRepository;

@Service
public class CategoryService {

  @Autowired
  public ICategoryRepository categoryRepository;
  
  // fetch category
  public Category fetchCategory(Integer categoryId) {
    var categoryResult = this.categoryRepository.findById(categoryId);
    if (!categoryResult.isEmpty()) {
    } else {
        return null;
      }
  Category existingCategory = categoryResult.get();
    return existingCategory;
  }

  // update category
  public void updateCategory(Category updatedName, Category existingCategory) {

    if (updatedName.getName() != null && !updatedName.getName().isBlank()) {
      existingCategory.setName(updatedName.getName());
    }

    this.categoryRepository.save(existingCategory);
  }


}