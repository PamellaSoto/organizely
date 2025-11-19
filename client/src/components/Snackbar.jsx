
const Snackbar = ({ visible, message, onUndo, undoLabel = 'Desfazer' }) => {
  if (!visible) return null;
  return (
    <div className="fixed left-4 bottom-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center gap-4 z-50">
      <div>{message}</div>
      {onUndo && (
        <button onClick={onUndo} className="underline">{undoLabel}</button>
      )}
    </div>
  );
};

export default Snackbar;
