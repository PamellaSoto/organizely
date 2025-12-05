import { useState, useEffect, useCallback } from "react";
import * as API from "../utils/api";
import { useDragAndDrop } from "./useDragAndDrop";
import { useMenuActions } from "./useMenuActions";

export const useTasks = (showSnackbar) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const getTasks = useCallback(() => tasks, [tasks]);

  // load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTasks = async () => {
    try {
      const data = await API.getTasks();
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading tasks:", error);
      showSnackbar({ message: "Erro ao carregar tarefas", onUndo: null });
      setIsLoading(false);
    }
  };

  const { handleDragEnd } = useDragAndDrop(getTasks, setTasks, showSnackbar);
  const { clearPending } = useMenuActions(getTasks, setTasks, showSnackbar);

  // create new task (local)
  const createNewTask = () => {
    const tempId = `temp-${Date.now()}`;
    setNewTasks((prev) => [
      {
        id: tempId,
        description: "",
        isEditing: true,
        dayOfWeek: "backlog",
        isCompleted: false,
        priority: 0,
        category: null,
      },
      ...prev,
    ]);
  };

  const cancelNewTask = (tempId) => {
    setNewTasks((prev) => prev.filter((t) => t.id !== tempId));
  };

  // save new task to backend
  const saveNewTask = async (tempId, description) => {
    const trimmed = description.trim();
    if (!trimmed) {
      cancelNewTask(tempId);
      return;
    }

    try {
      const createdTask = await API.createTask({ description: trimmed });

      setNewTasks((prev) => prev.filter((t) => t.id !== tempId));
      setTasks((prev) => [createdTask, ...prev]);

      showSnackbar({
        message: "Tarefa criada!",
        onUndo: async () => {
          await API.deleteTask(createdTask.id);
          setTasks((prev) => prev.filter((t) => t.id !== createdTask.id));
        },
        undoLabel: "Desfazer",
      });

      createNewTask();
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbar({ message: "Erro ao criar tarefa", onUndo: null });
    }
  };

  // update task (DTO)
  const updateTask = async (taskId, updated) => {
    if (!updated.description?.trim()) return false;

    const oldTask = tasks.find((t) => t.id === taskId);
    if (!oldTask) return false;

    // monta DTO válido para Spring
    const payload = {
      description: updated.description,
      isCompleted: updated.isCompleted,
      dayOfWeek: updated.dayOfWeek,
      priority: Number(updated.priority),
      category: updated.category ? updated.category.id || updated.category : null,
    };

    try {
      const result = await API.updateTask(taskId, payload);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? result : t)));

      showSnackbar({
        message: "Tarefa atualizada!",
        onUndo: async () => {
          const restoredPayload = {
            description: oldTask.description,
            isCompleted: oldTask.isCompleted,
            dayOfWeek: oldTask.dayOfWeek,
            priority: Number(oldTask.priority),
            category: oldTask.category?.id || null,
          };

          const restored = await API.updateTask(taskId, restoredPayload);
          setTasks((prev) => prev.map((t) => (t.id === taskId ? restored : t)));
        },
        undoLabel: "Desfazer",
      });

      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbar({ message: "Erro ao atualizar tarefa", onUndo: null });
      return false;
    }
  };

  // toggle complete
  const toggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const payload = {
      description: task.description,
      isCompleted: !task.isCompleted,
      dayOfWeek: task.dayOfWeek,
      priority: Number(task.priority),
      category: task.category?.id || null,
    };

    try {
      const result = await API.updateTask(taskId, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? result : t))
      );
    } catch (error) {
      console.error("Error toggling complete:", error);
      showSnackbar({ message: "Erro ao atualizar tarefa", onUndo: null });
    }
  };

  // delete task
  const deleteTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await API.deleteTask(taskId);

      showSnackbar({
        message: "Tarefa removida",
        onUndo: async () => {
          const restored = await API.createTask({
            description: task.description,
          });

          setTasks((prev) => [restored, ...prev]);
        },
        undoLabel: "Desfazer",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks((prev) => [task, ...prev]);
      showSnackbar({ message: "Erro ao remover tarefa", onUndo: null });
    }
  };

  return {
    tasks,
    newTasks,
    isLoading,
    createNewTask,
    saveNewTask,
    cancelNewTask,
    toggleComplete,
    updateTask,
    deleteTask,
    handleDragEnd,
    clearPending,
  };
};
