import type { ShelterProfile } from "../../../../packages/shared-types/src/profile.schema";
import { Link } from "react-router-dom"; 

// TODO connecter à la BDD

const ShelterCard = ({ shelter_name, description, pfc_user_id, /*logo_url */}: ShelterProfile) => {
  return (
    <div className="w-full max-w-sm">
      {/* Toute la carte cliquable vers détails */}
      <Link
        to={`/refuges/${pfc_user_id}`}
        className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div className="p-6 flex flex-col items-center">
          {/* Logo avec fallback */}
          <img
            src={/*logo_url ?? */"https://placehold.co/200x200?text=Pas+de+logo"}
            alt={`${shelter_name} logo`}
            className="w-32 h-32 rounded-full mb-6 object-cover bg-gray-200"
          />

          {/* Nom du refuge */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center font-montserrat">
            {shelter_name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 text-start">
              <span className="font-semibold ">Description :</span>
            </p>
          {description && (
            <p className="text-sm text-gray-600 mb-4 text-start">{description}</p>
          )}
        </div>
      </Link>

      {/* Bouton secondaire vers animaux */}
      <div className="flex justify-center mt-4">
        <Link
          to={`/refuges/${pfc_user_id}/animaux`}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
        >
          Voir les animaux
        </Link>
      </div>
    </div>
  );
};

export default ShelterCard;

