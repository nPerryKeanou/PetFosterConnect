// AnimalCard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Animal, Species } from "../../../../packages/shared-types/src/animal.schema";

// On définit le type exact retourné par NestJS + Prisma include
type AnimalWithDetails = Animal & {
  species: Species;
  shelter: {
    address: string | null;
    shelterProfile: {
      shelterName: string;
      description: string | null;
    } | null;
  };
};

const AnimalCard = ({
  id,
  name,
  photos,
  age,
  species,
  shelter,
}: AnimalWithDetails) => {
  const navigate = useNavigate(); // Initialise le hook
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photoArray = Array.isArray(photos) ? photos : [];

  useEffect(() => {
    if (photoArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photoArray.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [photoArray.length]);

  return (
    <div className="w-72 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 w-full overflow-hidden bg-gray-200">
        <img
          src={photoArray[currentPhotoIndex] || "https://via.placeholder.com/400x300"}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        {/* Indicateurs de progression (petits points) */}
        {photoArray.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photoArray.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentPhotoIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <div className="space-y-1 mb-3">
          <p className="text-sm text-gray-600"><span className="font-medium">Espèce :</span> {species?.name}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Âge :</span> {age}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Refuge :</span> {shelter?.shelterProfile?.shelterName}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/animaux/${id}`)}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-95"
        >
          Plus d'infos
        </button>
      </div>
    </div>
  );
};

export default AnimalCard;