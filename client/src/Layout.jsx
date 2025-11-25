import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import TaskGrid from "./components/TaskGrid";
import MenuActions from "./components/MenuActions";
import EditingTaskModal from "./components/EditingTaskModal";
import Snackbar from "./components/Snackbar";
import { loadTasksFromStorage, saveTasksToStorage } from "./utils/localStorage";
import { useCategories } from "./hooks/useCategories";

const WELCOME_TASK = [
  {
    id: 1,
    description: "Bem-vindo ao Organizely! Edite ou remova esta tarefa.",
    isCompleted: false,
    priority: 3,
    category: "Chores",
    container: "backlog",
  },
];

const Layout = () => {
  // Load tasks from localStorage or use default tasks
  const [backlogTasks, setBacklogTasks] = useState(() => {
    const storedTasks = loadTasksFromStorage();
    return storedTasks || WELCOME_TASK;
  });

  // Categories management
  const { categories, addCategory, removeCategory } = useCategories();

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasksToStorage(backlogTasks);
  }, [backlogTasks]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    onUndo: null,
    undoLabel: "Desfazer",
  });
  const [editedPending, setEditedPending] = useState(null);
  const snackbarTimerRef = useRef(null);

  const createTask = () => {
    const newTask = {
      id: Date.now(),
      description: "",
      isCompleted: false,
      priority: 0,
      category: "",
      container: "backlog",
      _isNew: true, // flag para saber se é task nova
    };
    setBacklogTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    setModalVisible(true);
  };

  // dnd context
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result || {};
    if (!destination) return;

    const sourceContainer = source.droppableId;
    const destContainer = destination.droppableId;
    const draggableTaskId = Number(draggableId);

    if (sourceContainer === destContainer && source.index === destination.index)
      return;

    setBacklogTasks((prev) => {
      const draggedTask = prev.find((t) => t.id === draggableTaskId);
      if (!draggedTask) return prev;

      const withoutDragged = prev.filter((t) => t.id !== draggableTaskId);
      const destTasks = withoutDragged.filter(
        (t) => t.container === destContainer
      );
      let insertBeforeId = null;
      if (destination.index < destTasks.length) {
        insertBeforeId = destTasks[destination.index].id;
      }

      const newDragged = { ...draggedTask, container: destContainer };

      if (insertBeforeId == null) {
        const lastIndex = (() => {
          let idx = -1;
          for (let i = 0; i < withoutDragged.length; i++) {
            if (withoutDragged[i].container === destContainer) idx = i;
          }
          return idx;
        })();

        if (lastIndex === -1) {
          return [...withoutDragged, newDragged];
        } else {
          return [
            ...withoutDragged.slice(0, lastIndex + 1),
            newDragged,
            ...withoutDragged.slice(lastIndex + 1),
          ];
        }
      } else {
        const idx = withoutDragged.findIndex((t) => t.id === insertBeforeId);
        if (idx === -1) return [...withoutDragged, newDragged];
        return [
          ...withoutDragged.slice(0, idx),
          newDragged,
          ...withoutDragged.slice(idx),
        ];
      }
    });
  };

  const toggleComplete = (taskId) => {
    setBacklogTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  // save (create/update) task from modal
  const saveTask = (taskId, updated) => {
    const text = (updated.description || "").trim();
    if (text === "") {
      // Não salva nem fecha modal se descrição vazia
      return false;
    }
    let wasNew = false;
    setBacklogTasks((prev) => {
      const oldTask = prev.find((t) => t.id === taskId);
      if (oldTask && oldTask._isNew) wasNew = true;
      if (oldTask && !oldTask._isNew) setEditedPending({ ...oldTask });
      return prev.map((t) =>
        t.id === taskId ? { ...t, ...updated, _isNew: false } : t
      );
    });
    // Snackbar de criação
    setTimeout(() => {
      if (wasNew) {
        showSnackbar({
          message: "Tarefa criada com sucesso!",
          onUndo: () => {
            setBacklogTasks((prev) => prev.filter((t) => t.id !== taskId));
          },
          undoLabel: "Desfazer",
        });
      } else {
        showSnackbar({
          message: "Tarefa editada",
          onUndo: () => {
            if (editedPending)
              setBacklogTasks((prev) =>
                prev.map((t) =>
                  t.id === editedPending.id ? { ...editedPending } : t
                )
              );
          },
          undoLabel: "Desfazer",
        });
      }
    }, 0);
    return true;
  };

  const openEdit = (taskId) => {
    setSelectedTaskId(taskId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTaskId(null);
  };

  const handleDeleteWithUndo = (taskId) => {
    setBacklogTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;
      showSnackbar({
        message: "Tarefa removida",
        onUndo: () => {
          setBacklogTasks((p) => [task, ...p]);
        },
        undoLabel: "Desfazer",
      });
      return prev.filter((t) => t.id !== taskId);
    });
  };

  // Snackbar handler
  const showSnackbar = ({ message, onUndo, undoLabel = "Desfazer" }) => {
    setSnackbar({ visible: true, message, onUndo, undoLabel });
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
    snackbarTimerRef.current = setTimeout(() => {
      setSnackbar((s) => ({ ...s, visible: false }));
      setEditedPending(null);
      snackbarTimerRef.current = null;
    }, 5000);
  };

  // move all not-completed tasks back to backlog
  const clearPending = () => {
    setBacklogTasks((prev) => {
      const affected = prev.filter(
        (t) => !t.isCompleted && t.container !== "backlog"
      );
      if (affected.length === 0) return prev;
      showSnackbar({
        message: `Tarefas pendentes movidas para o backlog`,
        onUndo: () => {
          setBacklogTasks((p) =>
            p.map((t) => {
              const found = affected.find((a) => a.id === t.id);
              return found ? { ...t, container: found.container } : t;
            })
          );
        },
        undoLabel: "Desfazer",
      });
      return prev.map((t) =>
        t.isCompleted ? t : { ...t, container: "backlog" }
      );
    });
  };

  const showPomodoro = () => {
    alert("Em breve.");
  };

  return (
    <div className="flex flex-col h-dvh bg-gray-200 py-3 px-1.5 gap-4">
      <Header />
      <main className="flex flex-col flex-1 overflow-y-auto scrollbar pr-2 overflow-x-hidden">
        <MenuActions
          createTaskMethod={createTask}
          clearPendingMethod={clearPending}
          pomodoroMethod={showPomodoro}
        />

        <TaskGrid
          backlogTasks={backlogTasks}
          onToggleComplete={toggleComplete}
          onDragEnd={handleDragEnd}
          onOpenEdit={openEdit}
        />
        <EditingTaskModal
          visible={modalVisible}
          onClose={closeModal}
          task={backlogTasks.find((t) => t.id === selectedTaskId)}
          onSave={(taskId, updated) => {
            const ok = saveTask(taskId, updated);
            if (ok) closeModal();
          }}
          onDelete={handleDeleteWithUndo}
          categories={categories}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
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
