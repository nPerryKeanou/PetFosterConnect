import { NavLink } from "react-router-dom";
import "./Footer.scss";
import logo from "../../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="footer w-full">
      <div className="footer__container">
        {/* Logo + nom */}
        <div className="footer__brand">
          <img src={logo} alt="Pet Foster Connect" />
          <span>Pet Foster Connect</span>
        </div>

        {/* Liens centraux */}
        <nav className="footer__nav">
          <NavLink to="/mentions-legales">Mentions légales</NavLink>
          <NavLink to="/confidentialite">Politique de confidentialité</NavLink>
          <NavLink to="/a-propos">À propos</NavLink>
        </nav>

        {/* Bouton contact */}
        <NavLink to="/contact" className="footer__contact">
          Nous contacter
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;
