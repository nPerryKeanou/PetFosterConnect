// import AnimalCard from "../components/AnimalCard";
// import { mockAnimalList } from "../mocks/animalList.mock";


// const animals = mockAnimalList;

// const AnimalList = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Nos animaux à adopter
//           </h1>
//           <p className="text-gray-600">
//             Découvrez tous nos compagnons qui attendent une famille aimante
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
//           {animals.map((animal) => (
//             <AnimalCard key={animal.id} {...animal} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnimalList;

import { useEffect, useState } from "react";
import AnimalCard from "../components/AnimalCard";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AnimalList = () => {
  // On initialise 'animals' comme un tableau vide
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à ton backend NestJS
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_URL}/animals`); // Vérifie ton port
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-500 animate-pulse">
          Chargement de nos compagnons...
        </p>
      </div>
    );
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {/* React boucle automatiquement sur le nombre d'objets reçus de la BDD */}
          {animals.map((animal) => (
            <Link to={`/animals/${animal.id}`} key={animal.id}>
                <AnimalCard {...animal} />
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalList;
