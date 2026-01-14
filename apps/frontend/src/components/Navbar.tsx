import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, _setIsLoggedIn] = useState(false);

  const links = [
    { to: "/", label: "Accueil" },
    { to: "/animaux", label: "Animaux" },
    { to: "/refuges", label: "Refuges" },
  ];

  if (isLoggedIn) {
    links.push({ to: "/profil", label: "Profil" });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium text-white transition hover:underline ${isActive ? "underline" : ""}`;

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
          to="/déconnexion"
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
