import { useState } from "react";
import { HiCheck } from "react-icons/hi";
import { HiPencil } from "react-icons/hi2";

const priorityColors = {
  High: "bg-green-200 text-green-700",
  Medium: "bg-yellow-200 text-yellow-700",
  Low: "bg-orange-200 text-orange-700",
};

const TaskItem = ({
  description,
  isCompleted = false,
  priority,
  categories = [],
  onToggleComplete,
  onUpdate,
}) => {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(description);

  return (
    <div
      className={[
        "rounded-xl p-3 transition-all cursor-pointer flex flex-col gap-1 relative border",
        hovered
          ? "border-tblue"
          : "border-tlightgray",
        isCompleted
          ? "line-through opacity-60 saturate-0"
          : "",
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center">
        {/* checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.();
          }}
          className={[
            "w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 absolute left-3 top-3",
            isCompleted
              ? "bg-tgray text-white"
              : "border-tlightgray",
          ].join(" ")}
        >
          {isCompleted && <HiCheck size={16} className="p-0.5" />}
        </div>

        {/* task description */}
        {!isEditing ? (
          <h3
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={[
              "ml-7 transition-all duration-300",
              isCompleted ? "line-through" : "",
            ].join(" ")}
          >
            {text}
          </h3>
        ) : (
          <input
            autoFocus
            className="ml-7 text-sm w-full border-b outline-none pb-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onUpdate?.(text);
            }}
          />
        )}
      </div>
      

      {/* CATEGORY TAGS */}
      {categories?.length > 0 && (
        <p className="text-xs ml-7 text-tgray opacity-70">
          {categories.join(" / ")}
        </p>
      )}

      {/* PRIORITY LABEL */}
      {priority && (
        <span
          className={[
            "text-xs px-2 py-0.5 rounded-full self-start ml-7",
            priorityColors[priority] || "bg-gray-200 text-gray-700",
          ].join(" ")}
        >
          {priority}
        </span>
      )}

      {/* EDIT ICON */}
      {hovered && !isCompleted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="absolute right-3 top-3 text-tgray opacity-70 hover:opacity-100 transition"
        >
          <HiPencil />
        </button>
      )}
    </div>
  );
};

export default TaskItem;
