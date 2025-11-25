import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { LuCircle, LuCircleCheckBig } from "react-icons/lu";

const TaskItem = ({
  description,
  isCompleted = false,
  priority = 0,
  category = '',
  onToggleComplete,
  onOpenEdit,
  isDragging
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={[
        "bg-white rounded-xl px-2.5 py-2 relative transition-smooth cursor-pointer flex items-center justify-between border overflow-hidden",
        hovered ? "border-tblue" : "border-tlightgray",
        isCompleted ? "line-through opacity-60 saturate-0" : "",
        isDragging ? "shadow-md scale-105" : ""
      ].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onOpenEdit?.();
      }}
    >
      <div className={`flex gap-2 items-center transition-smooth transform 
        ${hovered ? "transform translate-x-0 text-blue-500" : " -translate-x-5"}
        ${category ? 'items-start!' : ''}`
        }>
        {/* checkbox */}
        <div
          className={`transition-smoothcategory ? "mt-1" : ""} ${hovered ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.();
          }}
          >
          {!isCompleted ? (<LuCircle size={16}/>) : (<LuCircleCheckBig size={16}/>)}
        </div>

        {/* description and category */}
        <div className="w-11/12 flex flex-col justify-start"> 
          <h3>{description}</h3>
          {category != '' && (
            <p className="text-[0.85em] font-semibold text-tgray">
              {category}
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
              hovered ? "opacity-0" : "opacity-100"
          ].join(" ")}
        >
          {priority === 1 ? "Baixa" : priority === 2 ? "Média" : "Alta"}
        </span>
      )}
      {/* edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenEdit?.();
        }}
        className={`text-tgray flex-start transition-smooth transform ${hovered ? 'translate-x-0 opacity-100 cursor-pointer' : 'translate-x-6 opacity-0'}`}
      >
        <HiOutlinePencilAlt size={20}/>
      </button>

    </div>
  );
};

export default TaskItem;
