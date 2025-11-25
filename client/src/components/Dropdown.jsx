import { useState, useEffect, useRef } from "react";
import { HiX } from "react-icons/hi";
import ActionButton from "./ActionButton";

const Dropdown = ({
  label,
  optionalIcon,
  value,
  onChange,
  onClear,
  className = "",
  options = [],
  placeholder = "Selecione",
  renderButton,
  renderOption,
  customFooter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onClear?.();
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div className="flex justify-between">
        {label && (
          <label className="text-sm font-medium text-tgray mb-1 block">
            {label}
          </label>
        )}
      </div>
      <div className="relative">
        {renderButton ? (
          <div onClick={() => setIsOpen(!isOpen)}>
            {renderButton({
              isOpen,
              value,
              selectedOption,
              onClear: handleClear,
            })}
          </div>
        ) : (
          <ActionButton
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full border border-red flex-row-reverse justify-between hover:border-gray-400 
              ${value ? "bg-blue-50 text-blue-700" : "bg-white text-gray-700"}
              `}
            label={selectedOption?.label || placeholder}
            iconLabel={
              <span
                className={`transition-smooth ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              >
                {optionalIcon}
              </span>
            }
          />
        )}
        {isOpen && (
          <div
            className={`absolute top-full left-0 w-full mt-1 bg-white border border-tgray/30 rounded-lg shadow-lg z-10 ${className} p-2`}
          >
            {options.map((option) => (
              <div key={option.value}>
                {renderOption ? (
                  <div onClick={() => handleSelect(option.value)}>
                    {renderOption({
                      option,
                      isSelected: option.value === value,
                    })}
                  </div>
                ) : (
                  <ActionButton
                    onClick={() => handleSelect(option.value)}
                    className={`
                      transition-smooth text-sm w-full py-2.5 px-3 rounded-lg text-left hover:bg-gray-100
                      ${
                        option.value === value
                          ? "bg-tgray/20 font-semibold"
                          : ""
                      }
                    `}
                    label={option.label}
                  />
                )}
              </div>
            ))}

            {/* Footer customizado (ex: criar nova categoria) */}
            {customFooter && (
              <div className="border-t border-gray-200 mt-1">
                {customFooter({ close: () => setIsOpen(false) })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
