import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../api/api";

// Définition du type du contexte
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider à envelopper autour de ton App
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [_user, _setUserrr] = useState(null);

  const logout = async () => {
    await api.post("/auth/logout"); // supprime le cookie
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
