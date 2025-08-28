import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface GeneralContextProps {
  url: string;
  setUrl: (value: string) => void;
  remember: boolean;
  setRemember: (value: boolean) => void;
  isMenuOpened: boolean;
  setIsMenuOpened: (value: boolean) => void;
  treeNodeTitle: string;
  setTreeNodeTitle: (value: string) => void;
  yearId: number;
  setYearId: (value: number) => void;
  systemId: number;
  setSystemId: (value: number) => void;
  chartId: number;
  setChartId: (value: number) => void;
  defaultRowsPerPage: number; 
  setDefaultRowsPerPage: (value: number) => void;
  pageNumbers: number[];
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const GeneralContext = createContext<GeneralContextProps | undefined>(
  undefined
);

const getInitial = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  return saved !== null ? JSON.parse(saved) : defaultValue;
};

export const GeneralProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pageNumbers = [5, 10, 25];
  const [remember, setRemember] = useState<boolean>(() =>
    getInitial("remember", true)
  );
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(() =>
    getInitial("isMenuOpened", true)
  );
  const [treeNodeTitle, setTreeNodeTitle] = useState<string>(() =>
    getInitial("treeNodeTitle", "")
  );
  const [yearId, setYearId] = useState<number>(() => getInitial("yearId", 0));
  const [systemId, setSystemId] = useState<number>(() =>
    getInitial("systemId", 0)
  );
  const [chartId, setChartId] = useState<number>(() =>
    getInitial("chartId", 0)
  );
  const [defaultRowsPerPage, setDefaultRowsPerPage] = useState<number>(pageNumbers[1])
  
  // const [defaultRowsPerPage, setDefaultRowsPerPage] = useState<number>(() =>
  //   getInitial("defaultRowsPerPage", pageNumbers[1])
  // );
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [url, setUrl] = useState("http://www.ps.dotis.ir");  
  

  useEffect(() => {
    localStorage.setItem("isMenuOpened", JSON.stringify(isMenuOpened));
  }, [isMenuOpened]);
  useEffect(() => {
    localStorage.setItem("treeNodeTitle", JSON.stringify(treeNodeTitle));
  }, [treeNodeTitle]);
  useEffect(() => {
    localStorage.setItem("yearId", JSON.stringify(yearId));
  }, [yearId]);
  useEffect(() => {
    localStorage.setItem("systemId", JSON.stringify(systemId));
  }, [systemId]);
  useEffect(() => {
    localStorage.setItem("chartId", JSON.stringify(chartId));
  }, [chartId]);

  // useEffect(() => {
  //   localStorage.setItem(
  //     "defaultRowsPerPage",
  //     JSON.stringify(defaultRowsPerPage)
  //   );
  // }, [defaultRowsPerPage == 0 ? pageNumbers[1] : defaultRowsPerPage]);

  return (
    <GeneralContext.Provider
      value={{
        isMenuOpened,
        setIsMenuOpened,
        treeNodeTitle,
        setTreeNodeTitle,
        yearId,
        setYearId,
        systemId,
        setSystemId,
        chartId,
        setChartId,
        defaultRowsPerPage,
        setDefaultRowsPerPage,
        pageNumbers,
        isModalOpen,
        setIsModalOpen,
        remember,
        setRemember,
        url,
        setUrl
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
