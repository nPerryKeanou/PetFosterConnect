import { useEffect, useState } from "react";
import AnimalCard from "../components/AnimalCard";
import { Link } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { PawPrint } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AnimalList = () => {
  // On initialise 'animals' comme un tableau vide
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_URL}/animals`);
        if(!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Recherche de compagnons..." />
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
            <p className="text-xl text-error font-semibold mb-2">Oups ! Impossible de charger les animaux.</p>
            <p className="text-gray-500">Vérifiez votre connexion ou réessayez plus tard.</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Nos animaux à adopter
          </h1>
          <p className="text-gray-600">
            Découvrez tous nos compagnons qui attendent une famille aimante
          </p>
        </div>

        {/* Gestion liste vide */}
        {animals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                  <PawPrint className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">Aucun animal pour le moment</h3>
              <p className="text-gray-500 mt-2">Revenez plus tard, nos refuges ajoutent régulièrement de nouveaux compagnons !</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {animals.map((animal) => (
                <Link to={`/animaux/${animal.id}`} key={animal.id}>
                    <AnimalCard {...animal} />
                </Link>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AnimalList;