import TaskContainer from "./TaskContainer";

const TaskGrid = () => {
  return (
    <div className="flex-1 grid gap-3 h-full justify-items-stretch">
      <div className="md:row-start-1 md:row-end-5 md:col-start-1 md:col-end-2">
        <TaskContainer title="Tarefas pendentes" children={"Feed the cat"} />
      </div>

      <div className="md:row-start-1 md:row-end-3 md:col-start-2 md:col-end-3">
        <TaskContainer title="Segunda-feira" />
      </div>

      <div className="md:row-start-3 md:row-end-5 md:col-start-2 md:col-end-3">
        <TaskContainer title="Quinta-feira" />
      </div>

      <div className="md:row-start-1 md:row-end-3 md:col-start-3 md:col-end-4">
        <TaskContainer title="Terça-feira" />
      </div>

      <div className="md:row-start-3 md:row-end-5 md:col-start-3 md:col-end-4">
        <TaskContainer title="Sexta-feira" />
      </div>

      <div className="md:row-start-1 md:row-end-3 md:col-start-4 md:col-end-5">
        <TaskContainer title="Quarta-feira" />
      </div>

      <div className="md:row-start-3 md:row-end-4 md:col-start-4 md:col-end-5">
        <TaskContainer title="Sábado" />
      </div>

      <div className="md:row-start-4 md:row-end-5 md:col-start-4 md:col-end-5">
        <TaskContainer title="Domingo" />
      </div>
    </div>
  );
};

export default TaskGrid;
