import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import About from "./pages/About.tsx";
import AnimalDetail from "./pages/AnimalDetail";
import AnimalList from "./pages/AnimalList";
import AuthPage from "./pages/AuthPage";
import Legal from "./pages/Legal";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Fausse page d'accueil pour l'instant pour ne pas avoir d'erreur
const Home = () => (
  <div className="p-10 text-center">Bienvenue sur Pet Foster Connect</div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow">
        <Routes>
          {/* Route Accueil */}
          <Route path="/" element={<Home />} />

          {/* Routes Légales */}
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/a-propos" element={<About />} />

          {/* Route Détails Animal */}
          <Route path="/animaux/1" element={<AnimalDetail />} />

          {/* Routes Authentification */}
          <Route path="/connexion" element={<AuthPage />} />
          <Route path="/inscription" element={<AuthPage />} />
          <Route path="/animaux" element={<AnimalList />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
