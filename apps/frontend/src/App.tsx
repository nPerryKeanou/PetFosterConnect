import { Routes, Route } from "react-router-dom";
import AnimalDetail from "./pages/AnimalDetail";

// Fausse page d'accueil pour l'instant pour ne pas avoir d'erreur
const Home = () => <div className="p-10 text-center">Bienvenue sur Pet Foster Connect</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Route de détails animal */}
      {/* Plus tard on mettra : "/animaux/:id" */}
      <Route path="/animaux/1" element={<AnimalDetail />} />
    </Routes>
  );
}

export default App;
