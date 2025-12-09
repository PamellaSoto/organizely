import Header from "./components/Header";
import TaskGrid from "./components/task/TaskGrid";
import MenuActions from "./components/MenuActions";
import EditingTaskModal from "./components/modal/EditingTaskModal";
import ConfigModal from "./components/modal/ConfigModal";
import Snackbar from "./components/Snackbar";
import DailyAdviceBar from "./components/DailyAdviceBar";
import { useTasks } from "./hooks/useTasks";
import { useSnackbar } from "./hooks/useSnackbar";
import { useModals } from "./hooks/useModals";
import ArchiveModal from "./components/modal/ArchiveModal";
import { useTheme } from "./hooks/useTheme";
import { useCategories } from "./hooks/useCategories";
import { useArchivedTasks } from "./hooks/useArchivedTasks";
import { useEffect } from "react";

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
    archiveTask,
    archiveCompletedTasks,
    duplicateTask,
    reloadTasks,
  } = useTasks(showSnackbar);
  const {
    archivedTasks,
    isLoading: archivedLoading,
    loadArchivedTasks,
    unarchiveTask,
    unarchiveMultiple,
    deleteTask: deleteArchivedTask,
    deleteMultiple,
    restoreToBacklog,
  } = useArchivedTasks(showSnackbar);

  useEffect(() => {
    loadArchivedTasks();
  }, [loadArchivedTasks]);

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
      <DailyAdviceBar />
      <main
        className="flex flex-col flex-1 gap-2 p-3 pt-0 overflow-y-hidden z-4 w-full relative top-23 transition-smooth"
        style={{ backgroundColor }}
      >
        <MenuActions
          createTaskMethod={createNewTask}
          clearPendingMethod={clearPending}
          pomodoroMethod={() => alert("Em breve.")}
          archiveCompletedTasks={async () => {
            await archiveCompletedTasks();
            await loadArchivedTasks();
          }}
          onOpenArchive={() => openModal("archive")}
          archivedTasks={archivedTasks}
        />

        <TaskGrid
          tasks={tasks}
          newTasks={newTasks}
          onToggleComplete={toggleComplete}
          onDragEnd={handleDragEnd}
          onOpenEdit={(taskId) => openModal("editTask", taskId)}
          onDeleteTask={async (taskId) => {
            await deleteTask(taskId);
          }}
          onArchiveTask={async (taskId) => {
            await archiveTask(taskId);
            await loadArchivedTasks();
          }}
          onDuplicateTask={async (taskId) => {
            await duplicateTask(taskId);
          }}
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
          onArchive={async (taskId) => {
            await archiveTask(taskId);
            await loadArchivedTasks();
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
          archivedTasks={archivedTasks}
          isLoading={archivedLoading}
          onLoadTasks={loadArchivedTasks}
          onUnarchiveTask={async (taskId) => {
            await unarchiveTask(taskId);
            await reloadTasks();
            await loadArchivedTasks();
          }}
          onUnarchiveMultiple={async (ids) => {
            await unarchiveMultiple(ids);
            await reloadTasks();
            await loadArchivedTasks();
          }}
          onDeleteTask={deleteArchivedTask}
          onDeleteMultiple={async (ids) => {
            await deleteMultiple(ids);
            await loadArchivedTasks();
            await reloadTasks();
          }}
          onRestoreToBacklog={async (ids) => {
            await restoreToBacklog(ids);
            await reloadTasks();
            await loadArchivedTasks();
          }}
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
