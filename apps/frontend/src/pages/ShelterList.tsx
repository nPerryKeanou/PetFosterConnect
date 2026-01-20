import { useEffect, useState } from "react";
import ShelterCard from "../components/ShelterCard";

const API_URL = import.meta.env.VITE_API_URL;

const SheltersPage = () => {
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch(`${API_URL}/shelters`);
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setShelters(data);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  if (loading) return <p>Chargement des refuges...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center font-montserrat">
        Nos refuges partenaires
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {shelters.map((shelter) => (
          <ShelterCard key={shelter.pfcUserId} {...shelter} />
        ))}
      </div>
    </div>
  );
};

export default SheltersPage;
