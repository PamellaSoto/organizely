import { useState, useCallback } from "react";
import * as API from "../utils/api";

export const useArchivedTasks = (showSnackbar) => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadArchivedTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await API.getTasks();
      const archived = data.filter((t) => t.isArchived);
      setArchivedTasks(archived);
    } catch (error) {
      console.error("Failed to load archived tasks:", error);
      showSnackbar?.({
        message: "Erro ao carregar tarefas arquivadas.",
        onUndo: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  const unarchiveTask = useCallback(
    async (taskId) => {
      const task = archivedTasks.find((t) => t.id === taskId);
      if (!task) return;
      try {
        const updated = await API.updateTask(taskId, {
          description: task.description,
          isCompleted: false,
          isArchived: false,
          dayOfWeek: task.dayOfWeek,
          priority: task.priority,
          category: task.category?.id || null,
        });
        setArchivedTasks((prev) => prev.filter((t) => t.id !== taskId));
        showSnackbar({
          message: "Tarefa desarquivada.",
          onUndo: async () => {
            const restored = await API.updateTask(taskId, {
              description: updated.description,
              isCompleted: true,
              isArchived: true,
              dayOfWeek: updated.dayOfWeek,
              priority: updated.priority,
              category: updated.category?.id || null,
            });
            setArchivedTasks((prev) => [restored, ...prev]);
          },
          undoLabel: "Desfazer",
        });
      } catch (error) {
        console.error("Error unarchiving task:", error);
        showSnackbar({ message: "Erro ao desarquivar tarefa.", onUndo: null });
      }
    },
    [archivedTasks, showSnackbar]
  );

  const unarchiveMultiple = useCallback(
    async (taskIds) => {
      try {
        const tasksToRestore = archivedTasks.filter((t) => taskIds.includes(t.id));
        await Promise.all(
          tasksToRestore.map((task) =>
            API.updateTask(task.id, {
              description: task.description,
              isCompleted: false,
              isArchived: false,
              dayOfWeek: task.dayOfWeek,
              priority: task.priority,
              category: task.category?.id || null,
            })
          )
        );
        setArchivedTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));
        showSnackbar({
          message: `${tasksToRestore.length} tarefa(s) desarquivada(s).`,
          onUndo: async () => {
            await Promise.all(
              tasksToRestore.map((task) =>
                API.updateTask(task.id, {
                  description: task.description,
                  isCompleted: true,
                  isArchived: true,
                  dayOfWeek: task.dayOfWeek,
                  priority: task.priority,
                  category: task.category?.id || null,
                })
              )
            );
            setArchivedTasks((prev) => [...tasksToRestore, ...prev]);
          },
          undoLabel: "Desfazer",
        });
      } catch (error) {
        console.error("Error unarchiving multiple tasks:", error);
        showSnackbar({ message: "Erro ao desarquivar tarefas.", onUndo: null });
      }
    },
    [archivedTasks, showSnackbar]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      const task = archivedTasks.find((t) => t.id === taskId);
      if (!task) return;
      try {
        await API.deleteTask(taskId);
        setArchivedTasks((prev) => prev.filter((t) => t.id !== taskId));
        showSnackbar({
          message: "Tarefa deletada permanentemente.",
          onUndo: async () => {
            const restored = await API.createTask({
              description: task.description,
            });
            setArchivedTasks((prev) => [restored, ...prev]);
          },
          undoLabel: "Desfazer",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        showSnackbar({ message: "Erro ao deletar tarefa.", onUndo: null });
      }
    },
    [archivedTasks, showSnackbar]
  );

  const deleteMultiple = useCallback(
    async (taskIds) => {
      try {
        const tasksToDelete = archivedTasks.filter((t) => taskIds.includes(t.id));
        await Promise.all(tasksToDelete.map((task) => API.deleteTask(task.id)));
        setArchivedTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));
        showSnackbar({
          message: `${tasksToDelete.length} tarefa(s) deletada(s) permanentemente.`,
          onUndo: async () => {
            const restored = await Promise.all(
              tasksToDelete.map((task) => API.createTask({ description: task.description }))
            );
            setArchivedTasks((prev) => [...restored, ...prev]);
          },
          undoLabel: "Desfazer",
        });
      } catch (error) {
        console.error("Error deleting multiple tasks:", error);
        showSnackbar({ message: "Erro ao deletar tarefas.", onUndo: null });
      }
    },
    [archivedTasks, showSnackbar]
  );

  const restoreToBacklog = useCallback(
    async (taskIds) => {
      try {
        const tasksToRestore = archivedTasks.filter((t) => taskIds.includes(t.id));
        await Promise.all(
          tasksToRestore.map((task) =>
            API.updateTask(task.id, {
              description: task.description,
              isCompleted: false,
              isArchived: false,
              dayOfWeek: "backlog",
              priority: task.priority,
              category: task.category?.id || null,
            })
          )
        );
        setArchivedTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));
        showSnackbar({
          message: `${tasksToRestore.length} tarefa(s) restaurada(s).`,
          onUndo: async () => {
            await Promise.all(
              tasksToRestore.map((task) =>
                API.updateTask(task.id, {
                  description: task.description,
                  isCompleted: true,
                  isArchived: true,
                  dayOfWeek: task.dayOfWeek,
                  priority: task.priority,
                  category: task.category?.id || null,
                })
              )
            );
            setArchivedTasks((prev) => [...tasksToRestore, ...prev]);
          },
          undoLabel: "Desfazer",
        });
      } catch (error) {
        console.error("Error restoring tasks:", error);
        showSnackbar({ message: "Erro ao restaurar tarefas.", onUndo: null });
      }
    },
    [archivedTasks, showSnackbar]
  );

  return {
    archivedTasks,
    isLoading,
    loadArchivedTasks,
    unarchiveTask,
    unarchiveMultiple,
    deleteTask,
    deleteMultiple,
    restoreToBacklog,
  };
};
