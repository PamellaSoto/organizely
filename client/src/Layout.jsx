import Header from "./components/Header";
import TaskGrid from "./components/task/TaskGrid";
import MenuActions from "./components/MenuActions";
import EditingTaskModal from "./components/modal/EditingTaskModal";
import ConfigModal from "./components/modal/ConfigModal";
import Snackbar from "./components/Snackbar";
import { useTasks } from "./hooks/useTasks";
import { useSnackbar } from "./hooks/useSnackbar";
import { useModals } from "./hooks/useModals";
import ArchiveModal from "./components/modal/ArchiveModal";
import { useTheme } from "./hooks/useTheme";
import { useCategories } from "./hooks/useCategories";

const Layout = () => {
  const { snackbar, showSnackbar } = useSnackbar();
  const { modals, openModal, closeModal } = useModals();
  const { backgroundColor, changeBackgroundColor } = useTheme();
  const { categories, createCategory, deleteCategory, fetchCategories } =
    useCategories(showSnackbar);
  const {
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
  } = useTasks(showSnackbar);

  if (isLoading) {
    return (
      <div
        className="flex flex-col h-dvh p-3 items-center justify-center"
        style={{ backgroundColor }}
      >
        <p className="text-gray-500">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh relative" style={{ backgroundColor }}>
      <Header onOpenConfig={() => openModal("config")} />
      <main
        className="flex flex-col flex-1 gap-2 p-3 pt-0 overflow-y-hidden z-4 w-full relative top-23 transition-smooth"
        style={{ backgroundColor }}
      >
        <MenuActions
          createTaskMethod={createNewTask}
          clearPendingMethod={clearPending}
          pomodoroMethod={() => alert("Em breve.")}
          onOpenArchive={() => openModal("archive")}
        />

        <TaskGrid
          tasks={tasks}
          newTasks={newTasks}
          onToggleComplete={toggleComplete}
          onDragEnd={handleDragEnd}
          onOpenEdit={(taskId) => openModal("editTask", taskId)}
          onConfirmNew={saveNewTask}
          onCancelNew={cancelNewTask}
        />

        <EditingTaskModal
          visible={modals.editTask.visible}
          onClose={() => closeModal("editTask")}
          task={tasks.find((t) => t.id === modals.editTask.data)}
          onSave={async (taskId, updated) => {
            const ok = await updateTask(taskId, updated);
            if (ok) closeModal("editTask");
          }}
          onDelete={async (taskId) => {
            await deleteTask(taskId);
            closeModal("editTask");
          }}
          categories={categories}
        />

        <ConfigModal
          visible={modals.config.visible}
          onClose={() => closeModal("config")}
          backgroundColor={backgroundColor}
          onChangeBackgroundColor={changeBackgroundColor}
          categories={categories}
          onCreateCategory={createCategory}
          onDeleteCategory={deleteCategory}
          onRefreshCategories={fetchCategories}
        />

        <ArchiveModal
          visible={modals.archive.visible}
          onClose={() => closeModal("archive")}
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
