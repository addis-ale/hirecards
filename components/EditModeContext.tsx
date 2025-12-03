"use client";

import React, { createContext, useContext } from "react";

interface EditModeContextType {
  isEditMode: boolean;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
});

export const EditModeProvider: React.FC<{
  children: React.ReactNode;
  isEditMode: boolean;
}> = ({ children, isEditMode }) => {
  return (
    <EditModeContext.Provider value={{ isEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  return useContext(EditModeContext);
};
