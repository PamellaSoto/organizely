const TaskContainer = ({ children, title }) => (
  <div className="bg-white rounded-xl p-4 flex flex-col justify-between w-full h-full">
    <div>
      <h3>{title}</h3>
    </div>
    <div className="mt-4 flex-1 overflow-auto">
      {children}
    </div>
  </div>
);

export default TaskContainer;
