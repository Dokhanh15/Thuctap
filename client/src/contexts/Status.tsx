import { createContext, ReactElement, useContext, useState } from "react";

type Props = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const statusContext = createContext<Props | undefined>(undefined);

export const useStatus = () => {
  const context = useContext(statusContext);
  if (!context) throw new Error("useLoading must be used within a LoadingProvider");
  return context;
};

export const StatusProvider = ({ children }: { children: ReactElement }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <statusContext.Provider value={{ loading, setLoading }}>
      {children}
    </statusContext.Provider>
  );
};
