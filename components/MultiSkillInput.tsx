'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface MultiSkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSkillInput({ 
  skills, 
  onChange, 
  placeholder = "Type a skill and press Enter",
  className = ""
}: MultiSkillInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      // Remove last skill if backspace is pressed on empty input
      removeSkill(skills.length - 1);
    }
  };

  const addSkill = () => {
    const trimmedSkill = inputValue.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
      setInputValue('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    onChange(newSkills);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#278f8c] focus-within:border-transparent transition-all min-h-[48px]">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#d7f4f2] text-[#102a63] rounded-full text-sm font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="hover:bg-[#278f8c]/20 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={skills.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Type a skill and press Enter to add. You can add multiple skills.
      </p>
    </div>
  );
}
