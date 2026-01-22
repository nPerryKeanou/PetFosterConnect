import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackBanner from "../components/ui/BackBanner";

const API_URL = import.meta.env.VITE_API_URL;

const RefugeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("useParams id côté frontend:", id);

  const navigate = useNavigate();
  const [shelter, setShelter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect déclenché avec id:", id);
    const fetchShelter = async () => {
      try {
        if (!id) return; // évite l'appel avec undefined
        console.log("Appel API avec id:", id);
        const res = await fetch(`${API_URL}/shelters/${id}`);
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        const data = await res.json();
        console.log("Réponse backend:", data);
        setShelter(data);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelter();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce refuge ?")) return;
    try {
      if (!id) return;
      const res = await fetch(`${API_URL}/shelters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      navigate("/refuges");
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handleEdit = () => {
    if (!id) return;
    navigate(`/refuges/${id}/edit`);
  };

  if (loading) return <p>Chargement...</p>;
  if (!shelter) return <p>Refuge introuvable</p>;

  return (
    <div className="bg-bgapp font-openSans text-gray-800">
      <BackBanner to="/refuges" />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 font-montserrat">
          {shelter.shelterName}
        </h1>

        <div
          className="border-2 rounded-xl p-6 shadow-md flex flex-col md:flex-row gap-6 bg-bgapp font-openSans text-gray-800"
          style={{ borderColor: "#2D6A4F" }}
        >
          <img
            src={shelter.logoUrl ?? "https://placehold.co/150x150?text=Pas+de+logo"}
            alt={`${shelter.shelterName} logo`}
            className="w-32 h-32 rounded-full object-cover bg-gray-200"
          />

          <div className="flex flex-col justify-start">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">SIRET :</span> {shelter.siret}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Description :</span>
            </p>
            {shelter.description && (
              <p className="text-gray-800">{shelter.description}</p>
            )}
          </div>
        </div>

        {/* Boutons navigation */}
        <div className="mt-6 flex gap-4 justify-center">
          {shelter?.pfcUserId && (
            <Link
              to={`/refuges/${shelter.pfcUserId}/animaux`}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md transition"
            >
              Voir les animaux du refuge
            </Link>
          )}

          <button
            onClick={handleEdit}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition"
          >
            Modifier
          </button>

          <button
            onClick={handleDelete}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefugeDetailPage;
