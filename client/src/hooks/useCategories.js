import { useState, useEffect, useCallback, useRef } from "react";
import * as API from "../utils/api";

export const useCategories = (showSnackbar) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const didInitRef = useRef(false);

  // Load categories on mount
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    fetchCategories();
  }, []);

  // list all categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await API.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showSnackbar?.({
        message: "Erro ao carregar categorias.",
        onUndo: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  // create a category
  const createCategory = useCallback(
    async (name) => {
      if (!name?.trim()) return;

      try {
        const newCategory = await API.createCategory({ name: name.trim() });
        setCategories((prev) => [...prev, newCategory]);
        showSnackbar?.({
          message: "Categoria criada!",
          onUndo: async () => {
            try {
              await API.deleteCategory(newCategory.id);
              setCategories((prev) =>
                prev.filter((c) => c.id !== newCategory.id)
              );
            } catch {
              console.error("Failed to undo create category");
            }
          },
          undoLabel: "Desfazer",
        });
        return newCategory;
      } catch (error) {
        console.error("Failed to create category:", error);
        showSnackbar?.({
          message: "Erro ao criar categoria.",
          onUndo: null,
        });
      }
    },
    [showSnackbar]
  );

  // delete category
  const deleteCategory = useCallback(
    async (categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));

      try {
        await API.deleteCategory(categoryId);
        showSnackbar?.({
          message: "Categoria removida.",
          onUndo: async () => {
            try {
              const restored = await API.createCategory(category);
              setCategories((prev) => [...prev, restored]);
            } catch {
              console.error("Failed to undo delete category");
            }
          },
          undoLabel: "Desfazer",
        });
      } catch (error) {
        console.error("Failed to delete category:", error);
        setCategories((prev) => [...prev, category]);
        showSnackbar?.({
          message: "Erro ao remover categoria.",
          onUndo: null,
        });
      }
    },
    [showSnackbar, categories]
  );

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
};
