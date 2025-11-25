import TaskContainer from "./TaskContainer";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskGrid = ({
  backlogTasks = [],
  onToggleComplete,
  onDragEnd,
  onOpenEdit,
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

  const getTasksFor = (containerId) =>
    backlogTasks.filter((t) => t.container === containerId);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="grid grid-cols-4 gap-3 grid-rows-4 h-full transition-smooth"
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className={`flex flex-col bg-white rounded-lg p-3 ${col.className}`}
          >
            <Droppable droppableId={col.id}>
              {(provided) => (
                <TaskContainer
                  title={col.title}
                  innerRef={provided.innerRef}
                  droppableProps={provided.droppableProps}
                >
                  {getTasksFor(col.id).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(providedDraggable, snapshotDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          className="mb-3"
                        >
                          <TaskItem
                            description={task.description}
                            isCompleted={task.isCompleted}
                            priority={task.priority}
                            category={task.categories}
                            onToggleComplete={() => onToggleComplete?.(task.id)}
                            onOpenEdit={() => onOpenEdit?.(task.id)}
                            isDragging={snapshotDraggable.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <div style={{ display: "none" }}>{provided.placeholder}</div>
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
