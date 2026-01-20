import type { Animal } from "../../../../packages/shared-types/src/animal.schema";

// Type étendu pour l'affichage (simule une réponse API avec jointures)
type AnimalWithDetails = Animal & {
  species_name: string;
  shelter: {
    shelter_name: string;
    address: string;
  };
};

const _AnimalCard = ({
  name,
  photos,
  age,
  species_name,
  shelter,
}: AnimalWithDetails) => {
  return (
    <div className="w-72 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 w-full overflow-hidden bg-gray-200">
        <img
          src={photos?.[0] ?? "placeholder-image-url"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>

        <div className="space-y-1 mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Espèce :</span> {species_name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Âge :</span> {age}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Refuge :</span> {shelter.shelter_name}
          </p>
        </div>

        <div className="flex justify-between">
          {/* <button
            type="button"
            className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
          >
            Adopter
          </button>

          <button
            type="button"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
          >
            Accueillir
          </button> */}
          <button
          type="button"
          onClick={() => console.log(`Redirection vers le profil de ${name} (ID: ${id})`)}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Plus d'infos
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        </div>
      </div>
    </div>
  );
};

export default _AnimalCard;
