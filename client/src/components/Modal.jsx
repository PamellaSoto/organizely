const Modal = ({ visible, onClose, children, title }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 z-10">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>
      </div>
    </div>
  );
};

export default Modal;
