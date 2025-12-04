const TaskContainer = ({ title, innerRef, droppableProps, children }) => {
  return (
    <>
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div ref={innerRef} {...droppableProps} className="min-h-[100px]">
        {children}
      </div>
    </>
  );
};

export default TaskContainer;
