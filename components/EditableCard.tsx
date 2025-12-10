"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useEditMode } from "./EditModeContext";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = "",
  multiline = false,
  placeholder = "Click to edit...",
  style,
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    // Merge style with overrides to ensure text is always visible
    const editStyle = { ...style, color: '#111827', backgroundColor: '#ffffff' };
    
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`w-full border-2 border-[#278f8c] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#278f8c]/20 resize-none transition-all text-sm`}
            placeholder={placeholder}
            style={editStyle}
            rows={1}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`w-full border-2 border-[#278f8c] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#278f8c]/20 transition-all text-sm`}
            placeholder={placeholder}
            style={editStyle}
          />
        )}
      </div>
    );
  }

  // If not in edit mode, just show the text without editing capability
  if (!isEditMode) {
    return (
      <div className={className} style={style}>
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-blue-50/50 rounded-lg px-2 py-1 -mx-2 -my-1 transition-all border-2 border-transparent hover:border-blue-200`}
      title="Click to edit"
      style={style}
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
    </div>
  );
};

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  className?: string;
  itemClassName?: string;
  markerColor?: string;
}

export const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  className = "",
  itemClassName = "",
  markerColor = "text-blue-600",
}) => {
  const { isEditMode } = useEditMode();

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleAddItem = () => {
    onChange([...items, "New item"]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className={className}>
      <ul 
        className={`list-disc pl-4 space-y-1 marker:${markerColor}`}
      >
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`relative ${isEditMode ? 'pr-2' : ''} group/item`}
          >
            <EditableText
              value={item}
              onChange={(value) => handleItemChange(index, value)}
              className={itemClassName}
              placeholder="Type here..."
            />
            {isEditMode && (
              <button
                onClick={() => handleRemoveItem(index)}
                className="absolute -right-1 top-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove item"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {isEditMode && (
        <button
          onClick={handleAddItem}
          className="mt-2 px-3 py-1.5 bg-[#278f8c] text-white text-xs rounded-lg hover:bg-[#1a6764] transition-colors shadow-md flex items-center gap-1.5"
        >
          <span className="text-base font-bold">+</span>
          Add Item
        </button>
      )}
    </div>
  );
};

interface EditableKeyValueProps {
  data: { label: string; value: string }[];
  onChange: (data: { label: string; value: string }[]) => void;
  className?: string;
}

export const EditableKeyValue: React.FC<EditableKeyValueProps> = ({
  data,
  onChange,
  className = "",
}) => {
  const { isEditMode } = useEditMode();

  const handleChange = (index: number, field: "label" | "value", newValue: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: newValue };
    onChange(newData);
  };

  const handleAddRow = () => {
    onChange([...data, { label: "New Label", value: "New Value" }]);
  };

  const handleRemoveRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  return (
    <div className={className}>
      <div className="space-y-1">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-1 border-b border-emerald-100 last:border-0 group/row relative pr-2">
            <EditableText
              value={item.label}
              onChange={(value) => handleChange(idx, "label", value)}
              className="text-xs font-medium"
              placeholder="Label..."
            />
            <EditableText
              value={item.value}
              onChange={(value) => handleChange(idx, "value", value)}
              className="text-xs font-bold text-emerald-700"
              placeholder="Value..."
            />
            {isEditMode && (
              <button
                onClick={() => handleRemoveRow(idx)}
                className="absolute -right-1 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove row"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
      {isEditMode && (
        <button
          onClick={handleAddRow}
          className="mt-2 px-3 py-1.5 bg-[#278f8c] text-white text-xs rounded-lg hover:bg-[#1a6764] transition-colors shadow-md flex items-center gap-1.5"
        >
          <span className="text-base font-bold">+</span>
          Add Row
        </button>
      )}
    </div>
  );
};
