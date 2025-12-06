import axios from "axios";

const BASE_URL = import.meta.env?.VITE_API_URL;
const api = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/api`,
});

// ========== TASK CRUD OPERATIONS ==========
// get all tasks
export const getTasks = async () => {
  try {
    const response = await api.get("/tasks/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// create a new task
export const createTask = async (task) => {
  try {
    const response = await api.post("/tasks/new", task);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// update an existing task
export const updateTask = async (taskId, task) => {
  try {
    const response = await api.put(`/tasks/${taskId}/edit`, task);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}/delete`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// ========== CATEGORY CRUD OPERATIONS ==========
// get all categories
export const getCategories = async () => {
  try {
    const response = await api.get("/categories/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// create a new category
export const createCategory = async (category) => {
  try {
    const response = await api.post("/categories/new", category);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}/delete`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export default api;
