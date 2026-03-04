import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import Loader from "../components/ui/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const location = useLocation();

  // 1. TANT QUE LE SERVEUR N'A PAS RÉPONDU (Refresh), ON NE FAIT RIEN
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader text="Vérification de la session..." />
      </div>
    );
  }

  // 2. SI PAS CONNECTÉ APRÈS CHARGEMENT -> REDIRECTION
  if (!isLoggedIn) {
    // On enregistre l'endroit où l'utilisateur voulait aller
    return <Navigate to="/inscription" state={{ from: location }} replace />;
  }

  // 3. SI RÔLE SPÉCIFIQUE REQUIS (ex: Admin)
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;