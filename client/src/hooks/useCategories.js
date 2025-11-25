import { useState, useEffect } from "react";
import {
  loadCategoriesFromStorage,
  saveCategoriesToStorage,
} from "../utils/localStorage";

const DEFAULT_CATEGORIES = [
  "Trabalho",
  "Pessoal",
  "Estudos",
  "Saúde",
  "Financeiro",
];

export const useCategories = () => {
  const [categories, setCategories] = useState(() => {
    const stored = loadCategoriesFromStorage();
    return stored || DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  const addCategory = (categoryName) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) return false;
    if (categories.includes(trimmedName)) return false;

    setCategories((prev) => [...prev, trimmedName]);
    return true;
  };

  const removeCategory = (categoryName) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryName));
  };

  const updateCategory = (oldName, newName) => {
    const trimmedName = newName.trim();
    if (!trimmedName) return false;
    if (oldName === trimmedName) return false;
    if (categories.includes(trimmedName)) return false;

    setCategories((prev) =>
      prev.map((cat) => (cat === oldName ? trimmedName : cat))
    );
    return true;
  };

  return {
    categories,
    addCategory,
    removeCategory,
    updateCategory,
  };
};
