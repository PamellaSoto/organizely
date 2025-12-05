import { useEffect } from "react";
import { HiX } from "react-icons/hi";

const Modal = ({ visible, onClose, title, children }) => {
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
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden={!visible}
      />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-800 hover:font-semibold"
        >
        <HiX size={20} />
        </button>
        {title && (
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
