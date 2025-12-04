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
    const loadTasks = async () => {
      try {
        const data = await API.getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
        showSnackbar({
          message: "Erro ao carregar tarefas",
          onUndo: null,
          undoLabel: "",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [showSnackbar]);

  // Hooks for specific functionalities
  const { handleDragEnd } = useDragAndDrop(getTasks, setTasks, showSnackbar);
  const { clearPending } = useMenuActions(getTasks, setTasks, showSnackbar);

  // create new task
  const createNewTask = () => {
    const tempId = `temp-${Date.now()}`;
    const tempTask = {
      id: tempId,
      description: "",
      isEditing: true,
      dayOfWeek: "backlog",
      isCompleted: false,
      priority: 0,
      category: null,
    };
    setNewTasks((prev) => [tempTask, ...prev]);
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
      showSnackbar({
        message: "Tarefa criada com sucesso!",
        onUndo: async () => {
          try {
            await API.deleteTask(createdTask.id);
            setTasks((prev) => prev.filter((t) => t.id !== createdTask.id));
          } catch {
            console.error("Failed to undo create");
          }
        },
        undoLabel: "Desfazer",
      });
      createNewTask();
    } catch (error) {
      console.error(error);
      showSnackbar({
        message: "Erro ao criar tarefa",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  // update task
  const updateTask = async (taskId, updated) => {
    const text = (updated.description || "").trim();
    if (text === "") return false;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    try {
      await API.updateTask(taskId, updated);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
      );
      showSnackbar({
        message: "Tarefa atualizada!",
        onUndo: async () => {
          try {
            await API.updateTask(taskId, task);
            setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
          } catch {
            console.error("Failed to undo update");
          }
        },
        undoLabel: "Desfazer",
      });
      return true;
    } catch {
      console.error("Failed to save task");
      showSnackbar({
        message: "Erro ao atualizar tarefa",
        onUndo: null,
        undoLabel: "",
      });
      return false;
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
          try {
            const restoredTask = await API.createTask(task);
            setTasks((prev) => [restoredTask, ...prev]);
          } catch {
            console.error("Failed to undo delete");
          }
        },
        undoLabel: "Desfazer",
      });
    } catch {
      setTasks((prev) => [task, ...prev]);
      showSnackbar({
        message: "Erro ao remover tarefa",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  // toggle task complete
  const toggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await API.updateTask(taskId, updatedTask);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
      showSnackbar({
        message: "Erro ao atualizar tarefa",
        onUndo: null,
        undoLabel: "",
      });
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
