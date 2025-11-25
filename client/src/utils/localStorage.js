const STORAGE_KEY = "organizely_tasks";
const CATEGORIES_KEY = "organizely_categories";

export const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar tarefas do localStorage:", error);
  }
  return null;
};

export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Erro ao salvar tarefas no localStorage:", error);
  }
};

export const clearTasksFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar tarefas do localStorage:", error);
  }
};

// Categorias
export const loadCategoriesFromStorage = () => {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar categorias do localStorage:", error);
  }
  return null;
};

export const saveCategoriesToStorage = (categories) => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Erro ao salvar categorias no localStorage:", error);
  }
};

export const clearCategoriesFromStorage = () => {
  try {
    localStorage.removeItem(CATEGORIES_KEY);
  } catch (error) {
    console.error("Erro ao limpar categorias do localStorage:", error);
  }
};
