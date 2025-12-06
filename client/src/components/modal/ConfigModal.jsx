import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import ActionButton from "../ActionButton";

import { HiPlus, HiCheck, HiX } from "react-icons/hi";

const COLORS = [
  { value: "#E5E7EB", label: "Cinza" },
  { value: "#D9B1FF", label: "Roxo" },
  { value: "#B1DBFF", label: "Azul" },
  { value: "#CBF4C9", label: "Verde" },
  { value: "#FFF2B1", label: "Amarelo" },
  { value: "#FFD8B1", label: "Laranja" },
  { value: "#FFCCC9", label: "Vermelho" },
];

const ConfigModal = ({
  visible,
  onClose,
  backgroundColor,
  onChangeBackgroundColor,
  categories,
  onCreateCategory,
  onDeleteCategory,
  onRefreshCategories,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const categoryInputRef = useRef(null);

  useEffect(() => {
    if (visible && onRefreshCategories) {
      onRefreshCategories();
    }
  }, [visible, onRefreshCategories]);

  useEffect(() => {
    if (visible && showCategoryInput) {
      categoryInputRef.current?.focus();
      categoryInputRef.current?.select();
    }
  }, [visible, showCategoryInput]);

  const handleBackgroundColor = (color) => {
    onChangeBackgroundColor(color);
  };

  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      await onCreateCategory(newCategoryName);
      setNewCategoryName("");
      setShowCategoryInput(false);
      if (onRefreshCategories) {
        onRefreshCategories();
      }
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={"Configurações"}>
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-tblack mb-2">Customização</h3>
        <Dropdown
          label={"Alterar cor de fundo"}
          options={COLORS}
          value={backgroundColor}
          onChange={handleBackgroundColor}
        />
      </section>
      <section className="mb-6 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-tblack">
            Gerenciar categorias
          </h3>
          <button onClick={() => setShowCategoryInput(!showCategoryInput)}>
            <HiPlus
              size={20}
              className="text-tgray cursor-pointer hover:outline-2 outline-tgray/20 rounded-md hover:text-tblue"
            />
          </button>
        </div>
        <p className="text-sm text-tgray">
          Adicione, edite ou remova categorias para organizar melhor suas
          tarefas.
        </p>
        <div className="py-2 min-h-[200px] max-h-[200px] overflow-y-scroll scrollbar pr-2">
          {showCategoryInput ? (
            <div className="absolute top-8 right-0 rounded-md flex justify-between items-center border-tgray/30 border bg-white p-2">
              <input
                ref={categoryInputRef}
                autoFocus
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                placeholder="Nova categoria..."
                className="outline-none px-3 py-2 border border-tgray/30 rounded-lg flex-1 mr-2 text-sm text-tgray focus:border-tblue focus:text-tblack transition-smooth"
              />
              <ActionButton
                onClick={handleCreateCategory}
                iconLabel={<HiCheck size={18} />}
                className="bg-tblue text-white"
                hovered="hover:bg-blue-600"
              ></ActionButton>
            </div>
          ) : null}

          <div>
            {categories.length === 0 ? (
              <p className="text-sm text-tgray text-center py-4">
                Nenhuma categoria criada ainda.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border-b border-gray-200"
                >
                  <span className="font-medium text-tgray">
                    {category.name}
                  </span>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-tgray hover:text-tblack cursor-pointer"
                  >
                    <HiX size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <ActionButton
        onClick={onClose}
        label="Fechar"
        className="bg-tblue text-white"
        hovered="hover:bg-blue-600"
      />
    </Modal>
  );
};

export default ConfigModal;
