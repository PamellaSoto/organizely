import TaskContainer from "./TaskContainer";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskGrid = ({
  tasks = [],
  newTasks = [],
  onToggleComplete,
  onDragEnd,
  onOpenEdit,
  onConfirmNew,
  onCancelNew,
}) => {
  const columns = [
    {
      id: "backlog",
      title: "Tarefas pendentes",
      className: "row-start-1 row-end-5 col-start-1 col-end-2",
    },
    {
      id: "monday",
      title: "Segunda-feira",
      className: "row-start-1 row-end-3 col-start-2 col-end-3",
    },
    {
      id: "thursday",
      title: "Quinta-feira",
      className: "row-start-3 row-end-5 col-start-2 col-end-3",
    },
    {
      id: "tuesday",
      title: "Terça-feira",
      className: "row-start-1 row-end-3 col-start-3 col-end-4",
    },
    {
      id: "friday",
      title: "Sexta-feira",
      className: "row-start-3 row-end-5 col-start-3 col-end-4",
    },
    {
      id: "wednesday",
      title: "Quarta-feira",
      className: "row-start-1 row-end-3 col-start-4 col-end-5",
    },
    {
      id: "saturday",
      title: "Sábado",
      className: "row-start-3 row-end-4 col-start-4 col-end-5",
    },
    {
      id: "sunday",
      title: "Domingo",
      className: "row-start-4 row-end-5 col-start-4 col-end-5",
    },
  ];

  const getTasksForColumn = (columnId) => {
    return tasks.filter((t) => t.dayOfWeek === columnId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-3 grid-rows-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`bg-white rounded-lg p-3 ${col.className}`}
          >
            <Droppable droppableId={col.id}>
              {(provided) => (
                <TaskContainer
                  title={col.title}
                  innerRef={provided.innerRef}
                  droppableProps={provided.droppableProps}
                >
                  {/* new task with input */}
                  {col.id === "backlog" &&
                    newTasks.map((task) => (
                      <div key={task.id} className="mb-3">
                        <TaskItem
                          task={task}
                          isEditing={true}
                          onConfirmNew={onConfirmNew}
                          onCancelNew={onCancelNew}
                        />
                      </div>
                    ))}

                  {/* list all tasks by column id */}
                  {getTasksForColumn(col.id).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(providedDrag, snapshotDrag) => (
                        <div className="mb-3">
                          <TaskItem
                            task={task}
                            provided={providedDrag}
                            snapshot={snapshotDrag}
                            onToggle={() => onToggleComplete(task.id)}
                            onEdit={() => onOpenEdit(task.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TaskContainer>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskGrid;
