const TaskContainer = ({ children, title, innerRef, droppableProps }) => {
  return (
    <>
      <h2 className="mb-4 text-base font-medium text-gray-700">{title}</h2>
      <div
        ref={innerRef}
        {...droppableProps}
        className="flex-1 overflow-y-auto scrollbar pr-2"
      >
        {children}
      </div>
    </>
  );
};

export default TaskContainer;
