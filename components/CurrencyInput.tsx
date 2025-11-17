"use client";

import { useState, useEffect } from "react";

interface CurrencyInputProps {
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
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function CurrencyInput({
  id,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatCurrency = (val: string) => {
    // Remove all non-digits
    const numbers = val.replace(/\D/g, "");
    if (!numbers) return "";

    // Convert to number and format with commas
    const number = parseInt(numbers, 10);
    return number.toLocaleString("en-US");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numbers = inputValue.replace(/\D/g, "");

    if (numbers) {
      const formatted = formatCurrency(numbers);
      setDisplayValue(`$${formatted}`);
      onChange({ target: { name, value: `$${formatted}` } });
    } else {
      setDisplayValue("");
      onChange({ target: { name, value: "" } });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Remove $ when focusing for easier editing
    if (displayValue.startsWith("$")) {
      const withoutDollar = displayValue.substring(1);
      setDisplayValue(withoutDollar);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Add $ back when blurring
    if (displayValue && !displayValue.startsWith("$")) {
      const formatted = `$${displayValue}`;
      setDisplayValue(formatted);
      onChange({ target: { name, value: formatted } });
    }
  };

  return (
    <input
      type="text"
      id={id}
      name={name}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      required={required}
      className={className}
      inputMode="numeric"
    />
  );
}
