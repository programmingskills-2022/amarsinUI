import React, { createContext, useContext, useState, ReactNode } from "react";

interface GeneralContextProps {
  isMenuOpened: boolean;
  setIsMenuOpened: (value: boolean) => void;
  treeNodeTitle: string;
  setTreeNodeTitle: (value:string) => void;
}

const GeneralContext = createContext<GeneralContextProps | undefined>(undefined);

export const GeneralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(true); 
  const [treeNodeTitle, setTreeNodeTitle] = useState<string>(''); 

  return (
    <GeneralContext.Provider
    value={{
        isMenuOpened,
        setIsMenuOpened, 
        treeNodeTitle,
        setTreeNodeTitle
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGeneralContext must be used within a GeneralProvider");
  }
  return context;
};