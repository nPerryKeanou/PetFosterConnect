import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import Legal from "./pages/Legal"; 
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About.tsx";
 

function App() {

  return (
    <div className="App">
      <Header />
      <Routes>
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/a-propos" element={<About />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
