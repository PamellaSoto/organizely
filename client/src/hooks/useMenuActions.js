import * as API from "../utils/api";

export const useMenuActions = (getTasks, setTasks, showSnackbar) => {
  const buildPayload = (task, overrides = {}) => ({
    description:
      overrides.description !== undefined
        ? overrides.description
        : task.description,
    isCompleted:
      overrides.isCompleted !== undefined
        ? overrides.isCompleted
        : task.isCompleted,
    isArchived:
      overrides.isArchived !== undefined
        ? overrides.isArchived
        : task.isArchived || false,
    dayOfWeek:
      overrides.dayOfWeek !== undefined ? overrides.dayOfWeek : task.dayOfWeek,
    priority: Number(
      overrides.priority !== undefined ? overrides.priority : task.priority
    ),
    category:
      overrides.category !== undefined
        ? overrides.category
        : task.category?.id || null,
  });

  const clearPending = async () => {
    const tasks = getTasks();
    const pendingTasks = tasks.filter(
      (t) => !t.isCompleted && t.dayOfWeek !== "backlog" && !t.isArchived
    );
    if (pendingTasks.length === 0) return;

    const updatedLocally = tasks.map((t) =>
      !t.isCompleted && t.dayOfWeek !== "backlog" && !t.isArchived
        ? { ...t, dayOfWeek: "backlog" }
        : t
    );
    setTasks(updatedLocally);

    try {
      await Promise.all(
        pendingTasks.map((task) =>
          API.updateTask(task.id, buildPayload(task, { dayOfWeek: "backlog" }))
        )
      );

      showSnackbar({
        message: `${pendingTasks.length} tarefa(s) movida(s).`,
        onUndo: async () => {
          try {
            await Promise.all(
              pendingTasks.map((task) =>
                API.updateTask(
                  task.id,
                  buildPayload(task, { dayOfWeek: task.dayOfWeek })
                )
              )
            );
            setTasks((prev) =>
              prev.map((t) => {
                const original = pendingTasks.find((p) => p.id === t.id);
                return original ? { ...t, dayOfWeek: original.dayOfWeek } : t;
              })
            );
          } catch {
            console.error("Failed to undo clear pending");
          }
        },
        undoLabel: "Desfazer",
      });
    } catch (error) {
      console.error("Error clearing pending:", error);
      setTasks(tasks);
      showSnackbar({
        message: "Erro ao mover tarefas.",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  const archiveCompletedTasks = async () => {
    const tasks = getTasks();
    const completed = tasks.filter((t) => t.isCompleted && !t.isArchived);
    if (completed.length === 0) return;

    const remaining = tasks.filter((t) => !(t.isCompleted && !t.isArchived));
    setTasks(remaining);

    try {
      await Promise.all(
        completed.map((task) =>
          API.updateTask(
            task.id,
            buildPayload(task, { isArchived: true, isCompleted: true })
          )
        )
      );
      showSnackbar?.({
        message: `${completed.length} tarefa(s) arquivada(s).`,
        onUndo: async () => {
          await Promise.all(
            completed.map((task) =>
              API.updateTask(
                task.id,
                buildPayload(task, {
                  isArchived: false,
                  isCompleted: task.isCompleted,
                })
              )
            )
          );
          setTasks((prev) => [...completed, ...prev]);
        },
        undoLabel: "Desfazer",
      });
    } catch (error) {
      console.error("Error archiving completed tasks:", error);
      setTasks(tasks);
      showSnackbar?.({
        message: "Erro ao arquivar tarefas.",
        onUndo: null,
      });
    }
  };

  return { clearPending, archiveCompletedTasks };
};
