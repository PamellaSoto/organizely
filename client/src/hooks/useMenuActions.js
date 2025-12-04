import * as API from "../utils/api";

export const useMenuActions = (getTasks, setTasks, showSnackbar) => {
  const usePomodoro = () => {
    alert("Em breve!");
  }
  
  

  const clearPending = async () => {
    const tasks = getTasks();
    const pendingTasks = tasks.filter(
      (t) => !t.isCompleted && t.dayOfWeek !== "backlog"
    );
    if (pendingTasks.length === 0) return;

    const updatedTasks = tasks.map((t) =>
      t.isCompleted ? t : { ...t, dayOfWeek: "backlog" }
    );
    setTasks(updatedTasks);

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
            setTasks((prev) =>
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
      setTasks(tasks);
      showSnackbar({
        message: "Erro ao mover tarefas",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  return { 
    clearPending, 
    usePomodoro 
  };
};
