"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7F4F2] focus:border-transparent transition-all text-left flex items-center justify-between text-sm ${className}`}
        style={{
          color: value ? "#000" : "#9ca3af",
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
              className="px-3 py-2 cursor-pointer transition-all rounded-lg text-sm"
              style={{
                backgroundColor:
                  hoveredIndex === index || value === option.value
                    ? "#D7F4F2"
                    : "transparent",
                color:
                  hoveredIndex === index || value === option.value
                    ? "#102a63"
                    : "#374151",
                margin: "4px",
                fontWeight: value === option.value ? "600" : "400",
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Hidden select for form validation */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="sr-only"
        tabIndex={-1}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
