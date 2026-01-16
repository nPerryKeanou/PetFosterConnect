import { useParams, Link } from "react-router-dom";
import { mockShelters } from "../mocks/Shelter.mock";
import BackBanner from "../components/ui/BackBanner";

// TODO connecter à la BDD , Faire le bouton pour le suppression et la modification


const RefugeDetailPage = () => {
    const { id } = useParams();
    const shelter = mockShelters.find((s) => s.pfc_user_id.toString() === id);

    if (!shelter) {
    return <div className="p-8">Refuge introuvable</div>;
    }

    return (
    <div className="bg-bgapp font-openSans text-gray-800">
    <BackBanner to="/refuges" />
        <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 font-montserrat">
            {shelter.shelter_name}
        </h1>

        
    <div
            className=" border-2 rounded-xl p-6 shadow-md flex flex-col md:flex-row gap-6 bg-bgapp font-openSans text-gray-800"
            style={{ borderColor: "#2D6A4F" }}
        >
        {/* Logo à gauche */}
        <img
            src={/*shelter.logo_url ?? */"https://placehold.co/150x150?text=Pas+de+logo"}
            alt={`${shelter.shelter_name} logo`}
            className="w-32 h-32 rounded-full object-cover bg-gray-200"
        />

        {/* Bloc texte à droite du logo */}
            <div className="flex flex-col justify-start">
              {/* SIRET */}
                <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">SIRET :</span> {shelter.siret}
                </p>

          {/* Description */}
                <p className="text-sm text-gray-600 ">
                    <span className="font-semibold text-start">Description :</span>
                </p>
            {shelter.description && (
                <p className="text-gray-800 text-start">{shelter.description}</p>
        )}
            </div>
    </div>

      {/* Boutons navigation */}
        <div className="mt-6 flex gap-4 justify-center">
        <Link
            to={`/refuges/${shelter.pfc_user_id}/animaux`}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
        >
            Voir les animaux du refuge
        </Link>
        
        </div>
    </div>
    </div>
    );
};

export default RefugeDetailPage;
