import { NavLink } from "react-router-dom";
import "./Navbar.scss";
import { useState } from "react";

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
    `text-sm font-medium transition ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar flex-1 flex items-center">
      {/* Les liens centrés */}
      <ul className="flex gap-6 m-0 p-0 list-none justify-center flex-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bouton login/déconnexion à droite */}
      {isLoggedIn ? (
        <NavLink to="/disconnect" className="header__login ml-4">
          Déconnexion
        </NavLink>
      ) : (
        <NavLink to="/login" className="header__login ml-4">
          Connexion / Inscription
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
