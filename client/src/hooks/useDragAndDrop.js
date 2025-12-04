import * as API from "../utils/api";

export const useDragAndDrop = (getTasks, setTasks, showSnackbar) => {
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const taskId = Number(draggableId);

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const tasks = getTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newDayOfWeek = destination.droppableId;
    const reordered = Array.from(tasks);
    const taskIndex = reordered.findIndex((t) => t.id === taskId);
    const [removed] = reordered.splice(taskIndex, 1);

    const destTasks = reordered.filter((t) => t.dayOfWeek === newDayOfWeek);

    let insertIndex;
    if (destination.index >= destTasks.length) {
      insertIndex = reordered.findIndex((t) => t.dayOfWeek === newDayOfWeek);
      if (insertIndex === -1) {
        insertIndex = reordered.length;
      } else {
        insertIndex = insertIndex + destTasks.length;
      }
    } else {
      const targetTask = destTasks[destination.index];
      insertIndex = reordered.findIndex((t) => t.id === targetTask.id);
    }

    reordered.splice(insertIndex, 0, { ...removed, dayOfWeek: newDayOfWeek });
    setTasks(reordered);

    try {
      await API.updateTask(taskId, { ...task, dayOfWeek: newDayOfWeek });
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(tasks);
      showSnackbar({
        message: "Erro ao mover tarefa",
        onUndo: null,
        undoLabel: "",
      });
    }
  };

  return { handleDragEnd };
};
