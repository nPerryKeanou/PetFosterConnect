//Page des details d'un seul refuge
//Url -> http://localhost:5173/refuges/48
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackBanner from "../components/ui/BackBanner";
import api from "../api/api";


const RefugeDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [shelter, setShelter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelter = async () => {
      if (!id) return;
      
      try {
        // ✅ Utilisation de l'instance api propre
        const response = await api.get(`/shelters/${id}`);
        setShelter(response.data);
      } catch (err) {
        console.error("Erreur API lors de la récupération du détail du refuge:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelter();
  }, [id]);

  if (loading) return (
    <div className="p-12 text-center font-openSans text-gray-500 italic">
      Chargement du refuge...
    </div>
  );

  if (!shelter) return (
    <div className="p-12 text-center font-openSans text-error font-bold">
      Refuge introuvable
    </div>
  );

  return (
    <div className="bg-bgapp font-openSans text-gray-800 min-h-screen">
      <BackBanner to="/refuges" />
      
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 font-montserrat text-secondary">
          {shelter.shelterName}
        </h1>

        <div
          className="border-2 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row gap-8 bg-white"
          style={{ borderColor: "#2D6A4F" }}
        >
          {/* Logo du refuge */}
          <div className="flex-shrink-0 flex justify-center items-center">
            <img
              src={shelter.logo ?? "https://placehold.co/150x150?text=Pas+de+logo"}
              alt={`${shelter.shelterName} logo`}
              className="w-32 h-32 rounded-full object-cover bg-gray-100 border-2 border-gray-50 shadow-sm"
            />
          </div>

          {/* Informations du refuge */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">SIRET</p>
              <p className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-md inline-block">
                {shelter.siret || "Non renseigné"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Description</p>
              <p className="text-gray-800 leading-relaxed italic">
                {shelter.description || "Ce refuge n'a pas encore ajouté de description."}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de navigation vers les animaux */}
        <div className="mt-12 flex justify-center">
          {shelter?.pfcUserId && (
            <Link
              to={`/refuges/${shelter.pfcUserId}/animaux`}
              className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-xl hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95"
            >
              Voir tous les animaux du refuge
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefugeDetailPage;
