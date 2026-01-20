import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/authContext.tsx";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import AnimalDetail from "./pages/AnimalDetail";
import AnimalList from "./pages/AnimalList";
import AuthPage from "./pages/AuthPage";
import Legal from "./pages/Legal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShelterAnimalPage from "./pages/ShelterAnimal.tsx";
import ShelterDetailPage from "./pages/ShelterDetail.tsx";
import SheltersPage from "./pages/ShelterList.tsx";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        
        {/* ZONE PUBLIQUE */}
        {/* Ces routes ont le Header et le Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/a-propos" element={<About />} />
          
          <Route path="/connexion" element={<AuthPage />} />
          <Route path="/inscription" element={<AuthPage />} />
          
          <Route path="/animaux" element={<AnimalList />} />
          <Route path="/animaux/:id" element={<AnimalDetail />} />
          
          <Route path="/refuges" element={<SheltersPage />} />
          <Route path="/refuges/:id" element={<ShelterDetailPage />} />
          <Route path="/refuges/:id/animaux" element={<ShelterAnimalPage />} />
        </Route>

        {/* ZONE ADMIN */}
        {/* Ces routes ont la Sidebar Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;