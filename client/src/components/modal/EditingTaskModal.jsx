import { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineFolderDownload,
  HiX,
} from "react-icons/hi";
import { LuCircle, LuCircleCheckBig } from "react-icons/lu";

import ActionButton from "../ActionButton";
import Dropdown from "./Dropdown";

const priorityConfig = {
  0: {
    label: "Nenhuma",
    color: "text-gray-700 border-gray-300",
    hoverColor: "hover:bg-tgray/10",
  },
  1: {
    label: "Baixa",
    color: "bg-tgreenlight text-tgreen",
    hoverColor: "hover:bg-tgreenlight/70",
  },
  2: {
    label: "Média",
    color: "bg-tyellowlight text-torange",
    hoverColor: "hover:bg-tyellowlight/70",
  },
  3: {
    label: "Alta",
    color: "bg-tredlight text-tred",
    hoverColor: "hover:bg-tredlight/70",
  },
};
const CONTAINER_MAP = [
  { id: "backlog", label: "Backlog" },
  { id: "monday", label: "Segunda" },
  { id: "tuesday", label: "Terça" },
  { id: "wednesday", label: "Quarta" },
  { id: "thursday", label: "Quinta" },
  { id: "friday", label: "Sexta" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const EditingTaskModal = ({
  visible,
  onClose,
  task,
  onSave,
  onDelete,
  onArchive,
  categories = [],
}) => {
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [priority, setPriority] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState("backlog");
  const [categoryId, setCategoryId] = useState(null);

  const priorityOptions = Object.entries(priorityConfig).map(
    ([key, config]) => ({
      value: Number(key),
      label: config.label,
      color: config.color,
      hoverColor: config.hoverColor,
    })
  );

  const positionOptions = CONTAINER_MAP.map((item) => ({
    value: item.id,
    label: item.label,
  }));

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  useEffect(() => {
    if (task && visible) {
      setDescription(task.description || "");
      setIsCompleted(task.isCompleted || false);
      setPriority(task.priority ?? 0);
      setDayOfWeek(task.dayOfWeek || "backlog");
      setCategoryId(task.category?.id || null);
    }
  }, [task, visible]);

  const handleSave = () => {
    if (!description.trim()) return;

    onSave?.(task?.id, {
      description: description.trim(),
      isCompleted,
      priority,
      dayOfWeek,
      category: categoryId,
    });
  };

  const handleDelete = () => {
    onDelete?.(task?.id);
  };

  const handleArchive = () => {
    onArchive?.(task?.id);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {task ? (
          <div>
            <div className="max-w-40">
              <Dropdown
                value={dayOfWeek}
                onChange={setDayOfWeek}
                options={positionOptions}
                className="overflow-y-hidden"
                optionalIcon={<HiOutlineChevronDown />}
                showClearButton={false}
              />
            </div>
            <div className="mt-4 flex gap-2 items-start">
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`text-tgray hover:text-tblue transition-colors
                  ${isCompleted ? "text-tblue" : ""}
                `}
              >
                {isCompleted ? (
                  <LuCircleCheckBig size={20} />
                ) : (
                  <LuCircle size={20} />
                )}
              </button>
              <textarea
                className={`
                  flex-1 text-2xl font-semibold -mt-2.5 resize-none focus:outline-1 rounded p-1 focus:outline-tblue
                  ${isCompleted ? "opacity-50" : ""}`}
                placeholder="Descrição da tarefa..."
                value={description}
                maxLength={70}
                rows={2}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* priority and category */}
            <div className="flex gap-3 border-b border-tgray/30 pb-4">
              <Dropdown
                label="Prioridade"
                value={priority}
                onChange={setPriority}
                onClear={() => setPriority(0)}
                options={priorityOptions}
                showClearButton={priority !== 0}
                renderButton={({ value, onClear }) => (
                  <button
                    className={`
                      w-full transition-all px-3 py-2 rounded-lg cursor-pointer
                      ${priorityConfig[value].color} 
                      ${priorityConfig[value].hoverColor} 
                      border border-
                      flex items-center justify-between group
                      text-sm font-semibold`}
                  >
                    <span>{priorityConfig[value].label}</span>
                    {value !== 0 && (
                      <HiX
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-smooth"
                        onClick={onClear}
                      />
                    )}
                  </button>
                )}
              />
              <Dropdown
                label="Categoria"
                value={categoryId}
                onChange={setCategoryId}
                onClear={() => setCategoryId(null)}
                showClearButton={categoryId !== null}
                options={categoryOptions}
                placeholder="Nenhuma"
                renderButton={({ value, onClear }) => (
                  <button
                    className={`
                      w-full transition-all px-3 py-2 rounded-lg cursor-pointer
                      flex items-center justify-between group
                      text-sm font-semibold border
                      ${
                        value !== null
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    <span>
                      {categoryOptions.find((opt) => opt.value === value)
                        ?.label || "Nenhuma"}
                    </span>
                    {value !== null && (
                      <HiX
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={onClear}
                      />
                    )}
                  </button>
                )}
              />
            </div>
            {/* action buttons */}
            <div className="flex justify-between pt-2">
              <div className="flex gap-3">
                <ActionButton
                  onClick={handleSave}
                  iconLabel={<HiOutlineCheckCircle size={16} />}
                  label="Salvar"
                  className="bg-tblue text-white"
                  hovered="hover:bg-blue-600"
                />
                <ActionButton
                  onClick={handleDelete}
                  iconLabel={<HiOutlineTrash size={16} />}
                  label="Excluir"
                  className="bg-tred text-white"
                  hovered="hover:bg-red-800"
                />
              </div>
              <div className="flex gap-3">
                <ActionButton
                  onClick={handleArchive}
                  iconLabel={<HiOutlineFolderDownload size={16} />}
                  label="Arquivar"
                  className="bg-tgray/20"
                  hovered="hover:bg-tgray/30"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500">Carregando tarefa...</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditingTaskModal;
