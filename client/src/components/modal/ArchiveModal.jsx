import Modal from "./Modal";

const ArchiveModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Tarefas Arquivadas</h2>

      <div className="space-y-4">
        <p className="text-gray-600">
          Aqui você verá todas as tarefas marcadas como concluídas e arquivadas.
        </p>
        
        <div className="p-8 bg-gray-100 rounded text-center text-gray-500">
          Nenhuma tarefa arquivada ainda
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default ArchiveModal;
