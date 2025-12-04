import { useState, useEffect } from "react";

const DEFAULT_BG_COLOR = "#E5E7EB";

export const useTheme = () => {
  const [backgroundColor, setBackgroundColor] = useState(() => {
    const saved = localStorage.getItem("organizely-bg-color");
    return saved || DEFAULT_BG_COLOR;
  });

  useEffect(() => {
    localStorage.setItem("organizely-bg-color", backgroundColor);
  }, [backgroundColor]);

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  return {
    backgroundColor,
    changeBackgroundColor
  };
};
