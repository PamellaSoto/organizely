import { useState, useEffect } from "react";

import {
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineFolderDownload,
  HiOutlineBan,
  HiCheck,
  HiX,
  HiPlus,
} from "react-icons/hi";
import { LuCircle, LuCircleCheckBig } from "react-icons/lu";

import Modal from "./Modal";
import ActionButton from "./ActionButton";
import Dropdown from "./Dropdown";

const priorityConfig = {
  0: {
    label: "Nenhuma",
    color: "border border-tgray text-tgray",
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

const containerLabels = [
  "Backlog",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const TEMP_CATEGORIES = [
  "Trabalho",
  "Pessoal",
  "Estudos",
  "Saúde",
  "Financeiro",
];

const EditingTaskModal = ({ visible, onClose, task, onSave, onDelete }) => {
  const [description, setDescription] = useState(task?.description || "");
  const [isCompleted, setIsCompleted] = useState(task?.isCompleted || false);
  const [priority, setPriority] = useState(task?.priority ?? 0);
  const [category, setCategory] = useState(
    (task?.categories && task.categories[0]) || ""
  );
  const [position, setPosition] = useState(
    task?.position || new Date().getDay()
  );
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const priorityOptions = Object.entries(priorityConfig).map(
    ([key, config]) => ({
      value: Number(key),
      label: config.label,
      color: config.color,
      hoverColor: config.hoverColor,
    })
  );

  const categoryOptions = TEMP_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const positionOptions = containerLabels.map((day, index) => ({
    value: index,
    label: day,
  }));

  useEffect(() => {
    setDescription(task?.description || "");
    setIsCompleted(task?.isCompleted || false);
    setPriority(task?.priority ?? 0);
    setCategory((task?.categories && task.categories[0]) || "");
    setPosition(task?.position || new Date().getDay());
  }, [task, visible]);

  const handleSave = () => {
    const updated = {
      ...task,
      description: description,
      isCompleted: isCompleted,
      priority: priority,
      categories: category ? [category] : [],
      position: position,
    };
    onSave?.(task?.id, updated);
    onClose?.();
  };

  const handleDelete = () => {
    onDelete?.(task?.id);
    onClose?.();
  };

  const handleCreateCategory = (closeDropdown) => {
    if (newCategoryName.trim()) {
      setCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsCreatingCategory(false);
      closeDropdown?.();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="max-w-40">
          <Dropdown
            value={position}
            onChange={setPosition}
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
                  flex items-center justify-between group
                  text-sm font-semibold`}
              >
                <span>{priorityConfig[value].label}</span>
                {value !== 0 && (
                  <HiX
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onClear}
                  />
                )}
              </button>
            )}
          />

          <Dropdown
            label="Categoria"
            value={category}
            onChange={setCategory}
            onClear={() => setCategory("")}
            options={categoryOptions}
            placeholder="Selecione"
            showClearButton={category !== ""}
            customFooter={({ close }) =>
              isCreatingCategory ? (
                <div className="py-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nova categoria"
                    className="w-full px-2 py-1 border border-tgray/60 rounded text-sm text-tgray/30 focus:outline-none focus:border-tblue focus:text-black"
                    autoFocus
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateCategory(close)
                    }
                  />
                  <ActionButton
                    onClick={() => handleCreateCategory(close)}
                    iconLabel={<HiCheck size={16} />}
                    className="bg-tblue text-white"
                    hovered="hover:bg-blue-600"
                  />
                  <ActionButton
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setNewCategoryName("");
                    }}
                    iconLabel={<HiX size={16} />}
                    className="bg-tred text-white"
                    hovered="hover:bg-red-800"
                  />
                </div>
              ) : (
                <ActionButton
                  onClick={() => setIsCreatingCategory(true)}
                  className={"text-tblue w-full mt-2"}
                  hovered={"hover:bg-tblue/20"}
                  label={"Criar nova categoria"}
                  iconLabel={<HiPlus size={16} />}
                />
              )
            }
          />
        </div>

        {/* Botões de ação */}
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
              onClick={handleSave}
              iconLabel={<HiOutlineFolderDownload size={16} />}
              label="Arquivar"
              className="bg-tgray/20"
              hovered="hover:bg-tgray/30"
            />
            <ActionButton
              onClick={onClose}
              iconLabel={<HiOutlineBan size={16} />}
              label="Cancelar"
              className="bg-tgray/20"
              hovered="hover:bg-tgray/30"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditingTaskModal;
