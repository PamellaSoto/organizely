import TaskContainer from "./TaskContainer";

const TaskGrid = () => {
  const gridClasses = "grid grid-cols-4 grid-rows-4 gap-3 h-full";

  return (
    <div className={gridClasses}>
      <div className="row-start-1 row-end-5 col-start-1 col-end-2">
        <TaskContainer title="Backlog" />
      </div>

      <div className="row-start-1 row-end-3 col-start-2 col-end-3">
        <TaskContainer title="Segunda-feira" />
      </div>

      <div className="row-start-3 row-end-5 col-start-2 col-end-3">
        <TaskContainer title="Quinta-feira" />
      </div>

      <div className="row-start-1 row-end-3 col-start-3 col-end-4">
        <TaskContainer title="Terça-feira" />
      </div>

      <div className="row-start-3 row-end-5 col-start-3 col-end-4">
        <TaskContainer title="Sexta-feira" />
      </div>

      <div className="row-start-1 row-end-3 col-start-4 col-end-5">
        <TaskContainer title="Quarta-feira" />
      </div>

      <div className="row-start-3 row-end-4 col-start-4 col-end-5">
        <TaskContainer title="Sábado" />
      </div>

      <div className="row-start-4 row-end-5 col-start-4 col-end-5">
        <TaskContainer title="Domingo" />
      </div>
    </div>
  );
};

export default TaskGrid;
