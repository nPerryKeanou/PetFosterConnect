import { NavLink, } from "react-router-dom";
import { useAuth } from "../auth/authContext";



const Navbar = () => {

  const { isLoggedIn, logout, user } = useAuth();
  const links = [
    { to: "/", label: "Accueil" },
    { to: "/animaux", label: "Animaux" },
    { to: "/refuges", label: "Refuges" },
  ];

  if (isLoggedIn && user) {
    links.push({ to: `/user/${user.id}/profil`, label: "Profil" });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium text-white transition hover:underline ${
      isActive ? "underline" : ""
    }`;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="flex items-center w-full">
      {/* Les liens centrés */}
      <ul className="flex gap-6 m-0 p-0 list-none justify-center flex-1">
        {links.map((link) => (
          <li key={link.to} className="transition">
            <NavLink to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bouton login/déconnexion à droite */}
      {isLoggedIn ? (
        <NavLink
          onClick={handleLogout}
          to="/"
          className="text-sm font-medium text-white transition hover:underline ml-4"
        >
          Déconnexion
        </NavLink>
      ) : (
        <NavLink
          to="/connexion"
          className="text-sm font-medium text-white transition hover:underline ml-4"
        >
          Connexion / Inscription
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
