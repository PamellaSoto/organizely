import { useState } from "react";

export const useModals = () => {
  const [modals, setModals] = useState({
    editTask: { visible: false, data: null },
    config: { visible: false, data: null },
    archive: { visible: false, data: null },
  });

  const openModal = (modalName, data) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: { visible: true, data },
    }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: { visible: false, data: null },
    }));
  };

  return {
    modals,
    openModal,
    closeModal,
  };
};