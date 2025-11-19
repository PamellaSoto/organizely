import { useState } from "react";
import { HiCheck } from "react-icons/hi";
import { HiPencil } from "react-icons/hi2";

const TaskItem = ({
  description,
  isCompleted = false,
  priority = 0,
  categories = [],
  onToggleComplete,
  onOpenEdit,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={[
        "rounded-xl p-3 transition-all cursor-pointer flex flex-col gap-1 relative border",
        hovered ? "border-tblue" : "border-tlightgray",
        isCompleted ? "line-through opacity-60 saturate-0" : "",
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onOpenEdit?.();
      }}
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
            hovered ? "bg-blue-500 text-white" : "opacity-0",
          ].join(" ")}
        >
          <HiCheck size={16} className="p-0.5" />
        </div>

        {/* task description (opens modal on click) */}
        <h3
          className={[
            "ml-7 transition-all duration-300",
            isCompleted ? "line-through opacity-60" : "",
          ].join(" ")}
        >
          {description}
        </h3>
      </div>

      {/* CATEGORY TAGS */}
      {categories?.length > 0 && (
        <p className="text-xs ml-7 text-tgray opacity-70">
          {categories.join(" / ")}
        </p>
      )}

      {/* PRIORITY LABEL (hidden on hover) */}
      {priority > 0 && !hovered && (
        <span
          className={[
            "text-xs px-2 py-0.5 rounded-full self-start ml-7",
            priority === 1
              ? "bg-green-50 text-green-700"
              : priority === 2
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700",
          ].join(" ")}
        >
          {priority === 1 ? "Baixa" : priority === 2 ? "Média" : "Alta"}
        </span>
      )}

      {/* EDIT ICON */}
      {hovered && !isCompleted && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEdit?.();
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
