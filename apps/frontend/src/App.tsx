import "./App.css";
import { useEffect } from "react";
import Footer from "./components/Footer/Footer.tsx";
import Header from "./components/Header/Header.tsx";

function App() {
  useEffect(() => {}, []);

  return (
    <div className="App">
      <Header />
      <Footer />
    </div>
  );
}

export default App;
