//import type { Animal } from "../../../../packages/shared-types/src/animal.schema";

// // Type étendu pour l'affichage (simule une réponse API avec jointures)
// type AnimalWithDetails = Animal & {
//   species_name: string;
//   shelter: {
//     shelter_name: string;
//     address: string;
//   };
// };

// const _AnimalCard = ({
//   name,
//   photos,
//   age,
//   species_name,
//   shelter,
// }: AnimalWithDetails) => {
//   return (
//     <div className="w-72 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
//       <div className="relative h-64 w-full overflow-hidden bg-gray-200">
//         <img
//           src={photos?.[0] ?? "placeholder-image-url"}
//           alt={name}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <div className="p-4">
//         <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>

//         <div className="space-y-1 mb-3">
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Espèce :</span> {species_name}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Âge :</span> {age}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Refuge :</span> {shelter.shelter_name}
//           </p>
//         </div>

//         <div className="flex justify-between">
//           {/* <button
//             type="button"
//             className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
//           >
//             Adopter
//           </button>

//           <button
//             type="button"
//             className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
//           >
//             Accueillir
//           </button> */}
//           <button
//           type="button"
//           onClick={() => console.log(`Redirection vers le profil de ${name} (ID: ${id})`)} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
//         >
//           Plus d'infos
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default _AnimalCard;


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

  // return (
  //   <div className="w-72 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
  //     <div className="relative h-64 w-full overflow-hidden bg-gray-200">
  //       {/* Correction de l'affichage de la photo */}
  //       <img
  //         src={Array.isArray(photos) && photos.length > 0 ? photos[0] : "https://via.placeholder.com/400x300?text=Pas+de+photo"}
  //         alt={name}
  //         className="w-full h-full object-cover"
  //       />
  //     </div>

  //     <div className="p-4">
  //       <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>

  //       <div className="space-y-1 mb-3">
  //         <p className="text-sm text-gray-600">
  //           {/* Accès à l'objet species inclus par Prisma */}
  //           <span className="font-medium">Espèce :</span> {species?.name || "Non spécifiée"}
  //         </p>
  //         <p className="text-sm text-gray-600">
  //           <span className="font-medium">Âge :</span> {age || "Inconnu"}
  //         </p>
  //         <p className="text-sm text-gray-600">
  //           {/* Accès profond au nom du refuge via shelterProfile */}
  //           <span className="font-medium">Refuge :</span> {shelter?.shelterProfile?.shelterName || "Refuge partenaire"}
  //         </p>
  //       </div>

  //       <div className="flex justify-between">
  //         {/* <button
  //           type="button"
  //           onClick={() => console.log(`Redirection vers le profil de ${name} (ID: ${id})`)} 
  //           className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
  //         >
  //           Plus d'infos
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  //           </svg>
  //         </button> */}
  //           <button
  //             type="button"
  //               onClick={() => navigate(`/animaux/${id}`)} // <-- On remplace le log par navigate
  //               className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-95 active:scale-90"
  //             >
  //               Plus d'infos
  //             {/* SVG icon */}
  //          </button>
  //       </div>
  //     </div>
  //   </div>
  // );
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