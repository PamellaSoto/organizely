import { useEffect } from "react";

const Modal = ({ visible, onClose, children }) => {
  useEffect(() => {
    if (!visible) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden={!visible}
      />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-gray-500 cursor-pointer hover:text-gray-800 hover:font-semibold"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
