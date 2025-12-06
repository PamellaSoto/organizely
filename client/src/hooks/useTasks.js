import { useState, useEffect, useCallback, useRef } from "react";
import * as API from "../utils/api";
import { useDragAndDrop } from "./useDragAndDrop";
import { useMenuActions } from "./useMenuActions";
import { buildTaskPayload } from "../utils/buildTaskPayload";

export const useTasks = (showSnackbar) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const getTasks = useCallback(() => tasks, [tasks]);
  const didInitRef = useRef(false);

  // load tasks on mount (evita chamadas duplicadas em StrictMode)
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadTasks();
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const data = await API.getTasks();
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading tasks:", error);
      showSnackbar?.({ message: "Erro ao carregar tarefas.", onUndo: null });
      setIsLoading(false);
    }
  }, [showSnackbar]);

  const { handleDragEnd } = useDragAndDrop(getTasks, setTasks, showSnackbar);
  const { clearPending, archiveCompletedTasks } = useMenuActions(getTasks, setTasks, showSnackbar);

  const createNewTask = () => {
    const tempId = `temp-${Date.now()}`;
    setNewTasks((prev) => [
      {
        id: tempId,
        description: "",
        isEditing: true,
        dayOfWeek: "backlog",
        isCompleted: false,
        isArchived: false,
        priority: 0,
        category: null,
      },
      ...prev,
    ]);
  };

  const cancelNewTask = (tempId) => {
    setNewTasks((prev) => prev.filter((t) => t.id !== tempId));
  };

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
      showSnackbar?.({
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
      showSnackbar?.({ message: "Erro ao criar tarefa.", onUndo: null });
    }
  };

  const updateTask = async (taskId, updated) => {
    if (!updated.description?.trim()) return false;
    const oldTask = tasks.find((t) => t.id === taskId);
    if (!oldTask) return false;

    const payload = buildTaskPayload(oldTask, updated);
    try {
      const result = await API.updateTask(taskId, payload);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? result : t)));
      showSnackbar?.({
        message: "Tarefa atualizada!",
        onUndo: async () => {
          const oldPayload = buildTaskPayload(oldTask);
          const restored = await API.updateTask(taskId, oldPayload);
          setTasks((prev) => prev.map((t) => (t.id === taskId ? restored : t)));
        },
        undoLabel: "Desfazer",
      });
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbar?.({ message: "Erro ao atualizar tarefa.", onUndo: null });
      return false;
    }
  };

  const toggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const payload = buildTaskPayload(task, { isCompleted: !task.isCompleted });
    try {
      const result = await API.updateTask(taskId, payload);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? result : t)));
    } catch (error) {
      console.error("Error toggling complete:", error);
      showSnackbar?.({ message: "Erro ao atualizar tarefa.", onUndo: null });
    }
  };

  const deleteTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await API.deleteTask(taskId);
      showSnackbar?.({
        message: "Tarefa removida.",
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
      showSnackbar?.({ message: "Erro ao remover tarefa.", onUndo: null });
    }
  };

  const archiveTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const payload = buildTaskPayload(task, {
      isCompleted: true,
      isArchived: true,
    });
    try {
      await API.updateTask(taskId, payload);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showSnackbar?.({
        message: "Tarefa arquivada.",
        onUndo: async () => {
          const oldPayload = buildTaskPayload(task);
          const restored = await API.updateTask(taskId, oldPayload);
          setTasks((prev) => [restored, ...prev]);
        },
        undoLabel: "Desfazer",
      });
    } catch (error) {
      console.error("Error archiving task:", error);
      showSnackbar?.({ message: "Erro ao arquivar tarefa.", onUndo: null });
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
    archiveTask,
    archiveCompletedTasks,
    reloadTasks: loadTasks,
  };
};
