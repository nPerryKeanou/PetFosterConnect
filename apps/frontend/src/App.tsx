import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/authContext.tsx";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
// Import des Pages
import About from "./pages/About.tsx";
import AnimalDetail from "./pages/AnimalDetail";
import AnimalList from "./pages/AnimalList";
import AuthPage from "./pages/AuthPage";
import Legal from "./pages/Legal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShelterAnimalPage from "./pages/ShelterAnimal.tsx";
import ShelterDetailPage from "./pages/ShelterDetail.tsx";
import SheltersPage from "./pages/ShelterList.tsx";

// Fausse page d'accueil pour l'instant pour ne pas avoir d'erreur
const Home = () => (
  <div className="p-10 text-center">Bienvenue sur Pet Foster Connect</div>
);

function App() {
  return (
    <AuthProvider>
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
            <Route path="/refuges" element={<SheltersPage />} />
            <Route path="/refuges/:id" element={<ShelterDetailPage />} />
            <Route
              path="/refuges/:id/animaux"
              element={<ShelterAnimalPage />}
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
