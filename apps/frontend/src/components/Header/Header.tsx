import logo from "../../assets/Logo.png";
import Navbar from "../Navbar/Navbar";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header w-full">
      <div className="header__container">
        {/* Logo + nom */}
        <div className="header__brand">
          <img src={logo} alt="Pet Foster Connect" />
          <span>Pet Foster Connect</span>
        </div>

        <Navbar />
      </div>
    </header>
  );
};

export default Header;
