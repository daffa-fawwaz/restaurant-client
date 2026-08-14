import { createContext, useContext, useState } from "react";

interface HeaderActionContextType {
  menuModalOpen: boolean;
  openMenuModal: () => void;
  closeMenuModal: () => void;

  tableModalOpen: boolean;
  openTableModal: () => void;
  closeTableModal: () => void;
}

const HeaderActionContext = createContext<HeaderActionContextType | undefined>(
  undefined,
);

export function HeaderActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);

  const openMenuModal = () => {
    setMenuModalOpen(true);
  };

  const closeMenuModal = () => {
    setMenuModalOpen(false);
  };

  const openTableModal = () => {
    setTableModalOpen(true);
  };

  const closeTableModal = () => {
    setTableModalOpen(false);
  };

  return (
    <HeaderActionContext.Provider
      value={{
        menuModalOpen,
        openMenuModal,
        closeMenuModal,

        tableModalOpen,
        openTableModal,
        closeTableModal,
      }}
    >
      {children}
    </HeaderActionContext.Provider>
  );
}

export function useHeaderAction() {
  const context = useContext(HeaderActionContext);

  if (!context) {
    throw new Error("useHeaderAction must be used inside HeaderActionProvider");
  }

  return context;
}
