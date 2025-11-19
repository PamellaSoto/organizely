import { useState, useEffect } from 'react';
import Modal from './Modal';

const priorityLabel = {
  0: 'Nenhuma',
  1: 'Baixa',
  2: 'Média',
  3: 'Alta'
};

const EditingTaskModal = ({ visible, onClose, task, onSave, onDelete }) => {
  const [description, setDescription] = useState(task?.description || '');
  const [isCompleted, setIsCompleted] = useState(task?.isCompleted || false);
  const [priority, setPriority] = useState(task?.priority ?? 0);
  const [category, setCategory] = useState((task?.categories && task.categories[0]) || '');

  useEffect(() => {
    setDescription(task?.description || '');
    setIsCompleted(task?.isCompleted || false);
    setPriority(task?.priority ?? 0);
    setCategory((task?.categories && task.categories[0]) || '');
  }, [task, visible]);

  const handleSave = () => {
    const updated = {
      ...task,
      description: description,
      isCompleted: isCompleted,
      priority: priority,
      categories: category ? [category] : []
    };
    onSave?.(task?.id, updated);
    onClose?.();
  };

  const handleDelete = () => {
    onDelete?.(task?.id);
    onClose?.();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Editar tarefa">
      <div className="flex flex-col gap-4">
        <label className="text-sm text-gray-700">Descrição</label>
        <textarea
          className="w-full border p-2 rounded resize-none focus:border-blue-400"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} />
            <span className="text-sm">Concluída</span>
          </label>

          <label className="text-sm">Prioridade</label>
          <select value={priority} onChange={(e) => setPriority(Number(e.target.value))} className="border rounded p-1">
            <option value={0}>Nenhuma</option>
            <option value={1}>Baixa</option>
            <option value={2}>Média</option>
            <option value={3}>Alta</option>
          </select>
          <span className="text-sm text-gray-500">{priorityLabel[priority]}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-1 rounded w-full"
          />
          <button onClick={() => setCategory('')} className="text-sm text-red-500">Remover</button>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancelar</button>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">Excluir</button>
          <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditingTaskModal;
