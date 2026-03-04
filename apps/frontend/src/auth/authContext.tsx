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
  user: any | null;
  setUser: (user: any | null) => void;
  isLoading: boolean;
}

// ✅ Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ✅ ON LIT LE LOCALSTORAGE DÈS LE DÉPART (Indispensable pour le Refresh)
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem("pfc_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("pfc_user"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // On vérifie quand même si la session est toujours valide côté serveur
        const response = await api.get("/auth/me");
        setUser(response.data);
        setIsLoggedIn(true);
        localStorage.setItem("pfc_user", JSON.stringify(response.data));
      } catch (error: any) {
        // Si le serveur répond 401 (non autorisé), on nettoie tout
        if (error.response?.status === 401) {
          setUser(null);
          setIsLoggedIn(false);
          localStorage.removeItem("pfc_user");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Erreur déconnexion", err);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("pfc_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, logout, user, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()