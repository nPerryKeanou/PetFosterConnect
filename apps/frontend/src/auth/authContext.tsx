import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../api/api";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  logout: () => Promise<void>;
  user: any | null; // ajoute l'utilisateur
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const logout = async () => {
    await api.post("/auth/logout");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setIsLoggedIn(true);
        setUser(res.data); // stocke l'utilisateur
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
