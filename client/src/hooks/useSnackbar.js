import { useState, useRef } from "react";

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    onUndo: null,
    undoLabel: "Desfazer",
  });
  const snackbarTimerRef = useRef(null);

  const showSnackbar = ({ message, onUndo, undoLabel = "Desfazer" }) => {
    setSnackbar({ visible: true, message, onUndo, undoLabel });
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
    snackbarTimerRef.current = setTimeout(() => {
      setSnackbar((s) => ({ ...s, visible: false }));
      snackbarTimerRef.current = null;
    }, 5000);
  };

  return { snackbar, showSnackbar };
};
