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
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
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

  if (loading) return <p>Chargement...</p>;
  if (!shelters.length) return <p>Aucun refuge trouvé</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {shelters.map((shelter) => (
        <ShelterCard key={shelter.pfcUserId} {...shelter} />
      ))}
    </div>
  );
};

export default SheltersPage;
