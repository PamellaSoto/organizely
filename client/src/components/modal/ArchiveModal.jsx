import { useState, useEffect } from "react";
import Modal from "./Modal";
import ActionButton from "../ActionButton";
import {
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineFolderRemove,
} from "react-icons/hi";

const ArchiveModal = ({
  visible,
  onClose,
  archivedTasks = [],
  onLoadTasks,
  onUnarchiveTask,
  onDeleteMultiple,
  onRestoreToBacklog,
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (visible && archivedTasks.length === 0) {
      onLoadTasks?.();
    }
  }, [visible]);

  const toggleSelectTask = (taskId) => {
    setSelectedTasks((prev) => {
      const isSelected = prev.includes(taskId);
      const newSelected = isSelected
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];

      setSelectAll(newSelected.length === archivedTasks.length);
      return newSelected;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks([]);
      setSelectAll(false);
    } else {
      setSelectedTasks(archivedTasks.map((t) => t.id));
      setSelectAll(true);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length > 0) {
      onDeleteMultiple?.(selectedTasks);
      setSelectedTasks([]);
      setSelectAll(false);
    }
  };

  const handleRestoreSelected = () => {
    if (selectedTasks.length > 0) {
      onRestoreToBacklog?.(selectedTasks);
      setSelectedTasks([]);
      setSelectAll(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={`Tarefas Arquivadas (${archivedTasks.length})`}
      classname="min-h-[600px]"
    >
      {archivedTasks.length === 0 ? (
        <p className="text-sm text-tgray/30 text-center py-4">
          Nenhuma tarefa arquivada.
        </p>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="align-middle">
                <th className="text-left pl-2 py-2">
                  <input
                    id="selectAll"
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-tblue"
                  />
                </th>
                <th className="text-left align-middle py-2 pl-2">
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    Selecionar todas ({selectedTasks.length}/
                    {archivedTasks.length})
                  </label>
                </th>
                <th className="text-right align-middle py-2 pr-2 w-2/5">
                  <p className="font-medium text-sm text-tgray">
                    {selectedTasks.length} tarefa(s) selecionada(s)
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto scrollbar">
              {archivedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t border-tgray/30 hover:bg-gray-100 transition-smooth align-middle"
                >
                  <td className="text-left align-middle pl-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleSelectTask(task.id)}
                      className="w-4 h-4 cursor-pointer accent-tblue"
                    />
                  </td>
                  <td className="text-left align-middle py-2 pl-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.description}</p>
                      {task.category && (
                        <p className="text-xs text-gray-500">
                          {task.category.name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="float-right align-middle py-2 pr-2">
                    <ActionButton
                      onClick={() => onUnarchiveTask?.(task.id)}
                      label="Desarquivar"
                      hovered={"hover:bg-gray-200"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedTasks.length > 0 && (
            <div className="absolute bottom-6 min-w-[520px] flex justify-between border-t border-tgray/30 pt-2 mt-4">
              <ActionButton
                onClick={handleRestoreSelected}
                iconLabel={<HiOutlineFolderRemove size={16} />}
                label="Restaurar"
                className="bg-tblue text-white"
                hovered="hover:bg-blue-600"
              />
              <ActionButton
                onClick={handleDeleteSelected}
                iconLabel={<HiOutlineTrash size={16} />}
                label="Excluir permanentemente"
                className="bg-tred text-white"
                hovered="hover:bg-red-800"
              />
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default ArchiveModal;
