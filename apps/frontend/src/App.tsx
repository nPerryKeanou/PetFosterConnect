import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext.tsx";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import UserSidebarLayout from "./components/layout/UserSidebarLayout.tsx";

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
import AdminAnimals from "./pages/admin/AdminAnimals";
import UserProfilePage from "./pages/profile/UserProfile.tsx";
import AnimalForm from "./pages/profile/AnimalForm.tsx"
// import UserAnimalsPage from "./pages/profile/UserAnimalsPage.tsx";
// import UserRequestsPage from "./pages/profile/UserRequestsPage.tsx";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ZONE PUBLIQUE */}
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

          {/* ESPACE UTILISATEUR */}
          <Route element={<UserSidebarLayout />}>
            <Route path="/user/:id/profil" element={<UserProfilePage />} />
            <Route path="/user/:id/profil/animaux/creer" element={<AnimalForm />} />
          </Route>

         {/* ZONE ADMIN */}
           {/* Ces routes ont la Sidebar Admin */}
            <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="animaux" element={<AdminAnimals />} />
          </Route>
        
        </Routes>
    </AuthProvider>
  );
}

export default App;
