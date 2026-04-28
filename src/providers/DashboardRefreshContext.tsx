import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardRefreshState {
  lastUpdated: Date;
  isTabVisible: boolean;
  isInteracting: boolean;
  setInteracting: (value: boolean) => void;
  refresh: () => void;
  getRefetchInterval: () => number | false;
}

const DashboardRefreshContext = createContext<DashboardRefreshState | null>(
  null
);

export function DashboardRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [isTabVisible, setIsTabVisible] = useState(() => !document.hidden);
  const [isInteracting, setIsInteractingState] = useState(false);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const setInteracting = useCallback((value: boolean) => {
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    setIsInteractingState(value);
    if (value) {
      interactionTimerRef.current = setTimeout(() => {
        setIsInteractingState(false);
      }, 3000);
    }
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries();
    setLastUpdated(new Date());
  }, [queryClient]);

  const getRefetchInterval = useCallback(() => {
    if (!isTabVisible) return false;
    if (isInteracting) return false;
    return 60000;
  }, [isTabVisible, isInteracting]);

  return (
    <DashboardRefreshContext.Provider
      value={{
        lastUpdated,
        isTabVisible,
        isInteracting,
        setInteracting,
        refresh,
        getRefetchInterval,
      }}
    >
      {children}
    </DashboardRefreshContext.Provider>
  );
}

export function useDashboardRefresh() {
  const ctx = useContext(DashboardRefreshContext);
  if (!ctx) {
    throw new Error(
      "useDashboardRefresh must be used within DashboardRefreshProvider"
    );
  }
  return ctx;
}
