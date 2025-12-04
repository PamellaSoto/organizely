import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import TaskGrid from "./components/TaskGrid";
import MenuActions from "./components/MenuActions";
import EditingTaskModal from "./components/EditingTaskModal";
import Snackbar from "./components/Snackbar";
import * as API from "./utils/api";

const Layout = () => {
  const [backlogTasks, setBacklogTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTask, setNewTask] = useState([]);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    onUndo: null,
    undoLabel: "Desfazer",
  });
  const snackbarTimerRef = useRef(null);

  // load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await API.getTasks();
        setBacklogTasks(tasks);
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
  }, []);

  // snackbar
  const showSnackbar = ({ message, onUndo, undoLabel = "Desfazer" }) => {
    setSnackbar({ visible: true, message, onUndo, undoLabel });
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
    snackbarTimerRef.current = setTimeout(() => {
      setSnackbar((s) => ({ ...s, visible: false }));
      snackbarTimerRef.current = null;
    }, 5000);
  };

  // create new task
  const createNewTask = () => {
    const tempId = `temp-${Date.now()}`;
    const newTask = {
      id: tempId,
      description: "",
      isEditing: true,
      dayOfWeek: "backlog",
      isCompleted: false,
      priority: 0,
      category: null,
    };
    setNewTask((prev) => [newTask, ...prev]);
  };

  const saveNewTask = async (tempId, description) => {
    const trimmed = description.trim();
    if (!trimmed) {
      cancelNewTask(tempId);
      return;
    }

    try {
      const createdTask = await API.createTask({ description: trimmed });
      setNewTask((prev) => prev.filter((t) => t.id !== tempId));
      setBacklogTasks((prev) => [createdTask, ...prev]);
      showSnackbar({
        message: "Tarefa criada com sucesso!",
        onUndo: async () => {
          try {
            await API.deleteTask(createdTask.id);
            setBacklogTasks((prev) =>
              prev.filter((t) => t.id !== createdTask.id)
            );
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

  const cancelNewTask = (tempId) => {
    setNewTask((prev) => prev.filter((t) => t.id !== tempId));
  };

  // toggle task complete
  const toggleComplete = async (taskId) => {
    const task = backlogTasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    setBacklogTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );

    try {
      await API.updateTask(taskId, updatedTask);
    } catch {
      setBacklogTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
      showSnackbar({
        message: "Erro ao atualizar tarefa",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  // dnd logic
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result || {};
    if (!destination) return;

    const sourceContainer = source.droppableId;
    const destContainer = destination.droppableId;
    const draggableTaskId = Number(draggableId);

    if (sourceContainer === destContainer && source.index === destination.index)
      return;

    const draggedTask = backlogTasks.find((t) => t.id === draggableTaskId);
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask, dayOfWeek: destContainer };

    const withoutDragged = backlogTasks.filter((t) => t.id !== draggableTaskId);
    const destTasks = withoutDragged.filter(
      (t) => t.dayOfWeek === destContainer
    );

    let newTask;
    if (destination.index >= destTasks.length) {
      const lastIndex = withoutDragged.reduce(
        (idx, t, i) => (t.dayOfWeek === destContainer ? i : idx),
        -1
      );

      if (lastIndex === -1) {
        newTask = [...withoutDragged, updatedTask];
      } else {
        newTask = [
          ...withoutDragged.slice(0, lastIndex + 1),
          updatedTask,
          ...withoutDragged.slice(lastIndex + 1),
        ];
      }
    } else {
      const insertBeforeId = destTasks[destination.index].id;
      const idx = withoutDragged.findIndex((t) => t.id === insertBeforeId);
      newTask = [
        ...withoutDragged.slice(0, idx),
        updatedTask,
        ...withoutDragged.slice(idx),
      ];
    }

    setBacklogTasks(newTask);

    try {
      await API.updateTask(draggableTaskId, updatedTask);
    } catch {
      setBacklogTasks(backlogTasks);
      showSnackbar({
        message: "Erro ao mover tarefa",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  // update task
  const updateTask = async (taskId, updated) => {
    const text = (updated.description || "").trim();
    if (text === "") {
      return false;
    }

    const oldTask = backlogTasks.find((t) => t.id === taskId);
    if (!oldTask) return false;

    try {
      await API.updateTask(taskId, updated);
      setBacklogTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
      );

      showSnackbar({
        message: "Tarefa atualizada!",
        onUndo: async () => {
          try {
            await API.updateTask(taskId, oldTask);
            setBacklogTasks((prev) =>
              prev.map((t) => (t.id === taskId ? oldTask : t))
            );
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
  const handleDelete = async (taskId) => {
    const task = backlogTasks.find((t) => t.id === taskId);
    if (!task) return;
    setBacklogTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await API.deleteTask(taskId);
      showSnackbar({
        message: "Tarefa removida",
        onUndo: async () => {
          try {
            const restoredTask = await API.createTask(task);
            setBacklogTasks((prev) => [restoredTask, ...prev]);
          } catch {
            console.error("Failed to undo delete");
          }
        },
        undoLabel: "Desfazer",
      });
    } catch {
      setBacklogTasks((prev) => [task, ...prev]);
      showSnackbar({
        message: "Erro ao remover tarefa",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  // modal
  const openEdit = (taskId) => {
    setSelectedTaskId(taskId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTaskId(null);
  };

  // clear pending tasks back to backlog
  const clearPending = async () => {
    const pendingTasks = backlogTasks.filter(
      (t) => !t.isCompleted && t.dayOfWeek !== "backlog"
    );
    if (pendingTasks.length === 0) return;

    const updatedTasks = backlogTasks.map((t) =>
      t.isCompleted ? t : { ...t, dayOfWeek: "backlog" }
    );
    setBacklogTasks(updatedTasks);

    try {
      await Promise.all(
        pendingTasks.map((task) =>
          API.updateTask(task.id, { ...task, dayOfWeek: "backlog" })
        )
      );
      showSnackbar({
        message: `${pendingTasks.length} tarefa(s) movida(s) para o backlog`,
        onUndo: async () => {
          try {
            await Promise.all(
              pendingTasks.map((task) => API.updateTask(task.id, task))
            );
            setBacklogTasks((prev) =>
              prev.map((t) => {
                const found = pendingTasks.find((a) => a.id === t.id);
                return found ? { ...t, dayOfWeek: found.dayOfWeek } : t;
              })
            );
          } catch {
            console.error("Failed to undo clear pending");
          }
        },
        undoLabel: "Desfazer",
      });
    } catch {
      // Rollback on error
      setBacklogTasks(backlogTasks);
      showSnackbar({
        message: "Erro ao mover tarefas",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  const showPomodoro = () => {
    alert("Em breve.");
  };

  // loading screen (api)
  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh bg-gray-200 p-3 items-center justify-center">
        <p className="text-gray-500">Carregando tarefas...</p>
      </div>
    );
  }

  // main layout
  return (
    <div className="flex flex-col h-dvh bg-gray-200 relative">
      <Header />
      <main className="flex flex-col flex-1 gap-2 p-3 pt-0 overflow-y-hidden z-4 w-full bg-gray-200 relative top-23 transition-smooth">
        <MenuActions
          createTaskMethod={createNewTask}
          clearPendingMethod={clearPending}
          pomodoroMethod={showPomodoro}
        />

        <TaskGrid
          tasks={backlogTasks}
          newTasks={newTask}
          onToggleComplete={toggleComplete}
          onDragEnd={handleDragEnd}
          onOpenEdit={openEdit}
          onConfirmNew={saveNewTask}
          onCancelNew={cancelNewTask}
        />
        <EditingTaskModal
          visible={modalVisible}
          onClose={closeModal}
          task={backlogTasks.find((t) => t.id === selectedTaskId)}
          onSave={async (taskId, updated) => {
            const ok = await updateTask(taskId, updated);
            if (ok) closeModal();
          }}
          onDelete={handleDelete}
        />
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          onUndo={snackbar.onUndo}
          undoLabel={snackbar.undoLabel}
        />
      </main>
    </div>
  );
};

export default Layout;
