import { NavLink, Outlet } from "react-router-dom";
import { UserCircle, PawPrint, Home, LogOut } from "lucide-react";
import { CiFolderOn } from "react-icons/ci"; 
import { LuPlus } from "react-icons/lu";
import { useAuth } from "../../auth/authContext";

export default function UserSidebarLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold font-montserrat text-primary">
              Mon espace
            </h2>
          </div>

          <nav className="p-4 space-y-2">
            {/* Profil */}
            <NavLink
              to={`/user/${user?.id}/profil`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <UserCircle className="w-5 h-5" />
              Mon Profil
            </NavLink>

            {/* Refuge : Mes Animaux + sous-menu */}
            {user?.role === "shelter" && (
              <div className="space-y-1">
                <NavLink
                  to={`/user/${user?.id}/animaux`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <PawPrint className="w-5 h-5" />
                  Mes Animaux
                </NavLink>

                {/* Sous-menu Créer un animal */}
                <div className="ml-8">
                  <NavLink
                    to={`/user/${user?.id}/profil/animaux/creer`}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                  >
                    <LuPlus className="w-5 h-5"/>
                    Ajouter un animal
                  </NavLink>
                </div>

                {/* Demandes reçues avec CiFolderOn */}
                <NavLink
                  to={`/user/${user?.id}/demandes-recus`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <CiFolderOn className="w-5 h-5" /> 
                  Demandes reçues
                </NavLink>
              </div>
            )}

            {/* Particulier : Mes Demandes */}
            {user?.role === "individual" && (
              <NavLink
                to={`/user/${user?.id}/demandes`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <CiFolderOn className="w-5 h-5" />
                Mes Demandes
              </NavLink>
            )}
          </nav>
        </div>

        {/* Pied de sidebar */}
        <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-secondary transition rounded-md hover:bg-gray-100"
          >
            <Home size={18} />
            <span>Retour au site</span>
          </NavLink>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-red-50 w-full rounded-lg transition font-medium"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
