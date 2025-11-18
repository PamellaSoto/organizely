const TaskContainer = ({ children, title }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 h-full">
      <h2 className="text-xl   font-semibold mb-4">{title}</h2>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default TaskContainer;
