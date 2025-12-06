import { useState, useRef, useEffect } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { LuCircle, LuCircleCheckBig } from "react-icons/lu";

const TaskItem = ({
  task,
  provided,
  snapshot,
  onToggle,
  onEdit,
  isEditing = false,
  onConfirmNew,
  onCancelNew,
}) => {
  const [hovered, setHovered] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const inputRef = useRef(null);

  const {
    description: taskDescription,
    isCompleted,
    isArchived,
    priority,
    category,
  } = task || {};

  const categoryName =
    category && typeof category === "object" ? category.name : "";
  const isDragging = snapshot?.isDragging;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirmNew(task.id, description);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancelNew(task.id);
    }
  };

  const handleBlur = () => {
    onCancelNew(task.id);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl px-3 py-2 border border-tblue mb-2">
        <input
          ref={inputRef}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Digite a descrição da tarefa..."
          maxLength={70}
          className="w-full outline-none text-sm"
        />
      </div>
    );
  }

  if (isArchived) return null;
  return (
    <div
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={[
        "bg-white rounded-xl px-2.5 py-2 relative transition-smooth cursor-pointer flex items-center justify-between border overflow-hidden",
        hovered ? "border-tblue" : "border-tlightgray",
        isCompleted ? "line-through opacity-60 saturate-0" : "",
        isDragging ? "shadow-md scale-105" : "",
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onEdit(task.id)}
    >
      <div
        className={`flex gap-2 items-center transition-smooth transform ${
          hovered ? "transform translate-x-0 text-blue-500" : " -translate-x-5"
        } ${category ? "items-start!" : ""}`}
      >
        {/* checkbox */}
        <div
          className={`transition-smooth ${category ? "mt-1" : ""} ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(task.id);
          }}
        >
          {!isCompleted ? (
            <LuCircle size={16} />
          ) : (
            <LuCircleCheckBig size={16} />
          )}
        </div>

        {/* description and category */}
        <div className="w-11/12 flex flex-col justify-start">
          <h3>{taskDescription}</h3>
          {categoryName && (
            <p className="text-[0.85em] font-semibold text-tgray">
              {categoryName}
            </p>
          )}
        </div>
      </div>

      {/* priority label */}
      {priority > 0 && (
        <span
          className={[
            "font-semibold text-[0.625em] xl:text-[0.8em] px-2 rounded-full self-start absolute right-3 transition-smooth",
            priority === 1
              ? "bg-tgreenlight text-tgreen"
              : priority === 2
              ? "bg-tyellowlight text-torange"
              : "bg-tredlight text-tred",
            hovered ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {priority === 1 ? "Baixa" : priority === 2 ? "Média" : "Alta"}
        </span>
      )}
      {/* edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(task.id);
        }}
        className={`text-tgray flex-start transition-smooth transform ${
          hovered
            ? "translate-x-0 opacity-100 cursor-pointer"
            : "translate-x-6 opacity-0"
        }`}
      >
        <HiOutlinePencilAlt size={20} />
      </button>
    </div>
  );
};

export default TaskItem;
