const ActionButton = ({ onClick, iconLabel, label, className, hovered}) => {
  return (
    <button 
      onClick={onClick} 
      className={`
        transition-smooth px-3 py-2 rounded-lg cursor-pointer text-sm font-semibold flex gap-2 items-center 
        ${className}
        ${hovered}
        `}
      >
      {iconLabel}
      {label}
      </button>
  )}

export default ActionButton;