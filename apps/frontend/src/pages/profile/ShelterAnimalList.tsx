import type { AnimalWithRelations } from "@projet/shared-types";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api"; // ✅ Import par défaut sans {}
import Badge from "../../components/ui/Badge";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import Loader from "../../components/ui/Loader";

const statusLabels: Record<string, string> = {
  available: 'Disponible',
  adopted: 'Adopté',
  foster_care: 'En accueil',
  unavailable: 'Indisponible'
};

export default function ShelterAnimalList() {
  const { id } = useParams<{ id: string }>();
  const [animals, setAnimals] = useState<AnimalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const [actionToConfirm, setActionToConfirm] = useState<{
    type: "delete" | "restore";
    id: number;
  } | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (!id) return;
      try {
        // ✅ Utilisation de l'instance api propre
        const res = await api.get<AnimalWithRelations[]>(
          `/shelters/${Number(id)}/animals`
        );
        setAnimals(res.data);
      } catch (error: any) {
        console.error("Erreur chargement animaux refuge:", error);
        toast.error(error.response?.data?.message || "Erreur de chargement des animaux");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, [id]);

  const handleConfirmAction = async () => {
    if (!actionToConfirm) return;
    const { type, id: animalId } = actionToConfirm;

    try {
      if (type === "delete") {
        await api.delete(`/animals/${animalId}`);
        setAnimals(prev =>
          prev.map((a) =>
            a.id === animalId ? { ...a, deletedAt: new Date() } : a
          )
        );
        toast.success("Animal déplacé dans la corbeille");
      } else {
        await api.patch(`/animals/${animalId}`, { deletedAt: null });
        setAnimals(prev =>
          prev.map((a) =>
            a.id === animalId ? { ...a, deletedAt: null } : a
          )
        );
        toast.success("Animal restauré avec succès");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
    setActionToConfirm(null);
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader text="Chargement de vos pensionnaires..." />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 font-montserrat">
          Gestion des Animaux
        </h1>
        <Link 
          to={`/user/${id}/profil/animaux/creer`}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-primary-dark transition"
        >
          + Ajouter un animal
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Espèce</th>
              <th className="px-6 py-4 hidden sm:table-cell">Âge</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {animals.length > 0 ? (
              animals.map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{animal.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{animal.name}</td>
                  <td className="px-6 py-4">{animal.species?.name ?? "Non spécifié"}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-500">{animal.age}</td>
                  <td className="px-6 py-4">
                    <Badge
                      label={animal.deletedAt ? "Supprimé" : (statusLabels[animal.animalStatus] ?? animal.animalStatus)}
                      variant={
                        animal.deletedAt ? "error" :
                        animal.animalStatus === "available" ? "success" : 
                        "default"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      <Link
                        to={`/user/${id}/profil/animaux/modifier`}
                        state={{ animal }} // ✅ On passe l'animal complet pour remplir le formulaire
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      {animal.deletedAt ? (
                        <button
                          type="button"
                          onClick={() => setActionToConfirm({ type: "restore", id: animal.id! })}
                          className="text-primary hover:bg-orange-50 p-2 rounded-full transition-colors"
                          title="Restaurer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActionToConfirm({ type: "delete", id: animal.id! })}
                          className="text-gray-400 hover:text-error hover:bg-red-50 p-2 rounded-full transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                  Aucun animal enregistré pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={!!actionToConfirm}
        onClose={() => setActionToConfirm(null)}
        onConfirm={handleConfirmAction}
        title={actionToConfirm?.type === "delete" ? "Bannir cet animal ?" : "Restaurer l'animal ?"}
        message={
          actionToConfirm?.type === "delete"
            ? "L'animal ne sera plus visible par les adoptants."
            : "L'animal sera de nouveau affiché sur la plateforme."
        }
      />
    </div>
  );
}