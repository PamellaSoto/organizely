import TaskContainer from "./TaskContainer";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TaskGrid = ({ backlogTasks = [], onToggleComplete, onDragEnd, onOpenEdit }) => {
  const columns = [
    { id: 'backlog', title: 'Tarefas pendentes', className: 'md:row-start-1 md:row-end-5 md:col-start-1 md:col-end-2' },
    { id: 'monday', title: 'Segunda-feira', className: 'md:row-start-1 md:row-end-3 md:col-start-2 md:col-end-3' },
    { id: 'thursday', title: 'Quinta-feira', className: 'md:row-start-3 md:row-end-5 md:col-start-2 md:col-end-3' },
    { id: 'tuesday', title: 'Terça-feira', className: 'md:row-start-1 md:row-end-3 md:col-start-3 md:col-end-4' },
    { id: 'friday', title: 'Sexta-feira', className: 'md:row-start-3 md:row-end-5 md:col-start-3 md:col-end-4' },
    { id: 'wednesday', title: 'Quarta-feira', className: 'md:row-start-1 md:row-end-3 md:col-start-4 md:col-end-5' },
    { id: 'saturday', title: 'Sábado', className: 'md:row-start-3 md:row-end-4 md:col-start-4 md:col-end-5' },
    { id: 'sunday', title: 'Domingo', className: 'md:row-start-4 md:row-end-5 md:col-start-4 md:col-end-5' }
  ];

  const getTasksFor = (containerId) => backlogTasks.filter(t => t.container === containerId);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 grid gap-3 h-full justify-items-stretch">
        {columns.map(col => (
          <div key={col.id} className={col.className}>
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="h-full">
                  <TaskContainer title={col.title}>
                    {getTasksFor(col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(providedDraggable) => (
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
                                categories={task.categories}
                                onToggleComplete={() => onToggleComplete?.(task.id)}
                                onOpenEdit={() => onOpenEdit?.(task.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </TaskContainer>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskGrid;
