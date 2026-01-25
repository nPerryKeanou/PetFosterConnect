import type { Animal } from "@projet/shared-types";
import { Eye, RotateCcw, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";

// Type étendu pour matcher le retour API (Relations Prisma)
type AnimalWithRelations = Animal & {
  species: { name: string };
  shelter: { shelterProfile: { shelterName: string } | null };
};

export default function AdminAnimals() {
  const [animals, setAnimals] = useState<AnimalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await api.get<AnimalWithRelations[]>("/animals");
        setAnimals(res.data);
      } catch (error) {
        console.error("Erreur chargement animaux:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  // FILTRAGE
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = animal.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || animal.animalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ACTION : SUPPRIMER
  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cet animal (Soft Delete) ?")) {
      try {
        await api.delete(`/animals/${id}`);
        setAnimals(
          animals.map((a) =>
            a.id === id ? { ...a, deletedAt: new Date() } : a
          )
        );
      } catch (_errorrrrr) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // ACTION : RESTAURER
  const handleRestore = async (id: number) => {
    if (confirm("Restaurer cet animal ?")) {
      try {
        // Envoi de deletedAt: null
        await api.patch(`/animals/${id}`, { deletedAt: null });
        setAnimals(
          animals.map((a) => (a.id === id ? { ...a, deletedAt: null } : a))
        );
      } catch (_errorrrrr) {
        alert("Erreur lors de la restauration");
      }
    }
  };

  if (loading) return <Loader text="Chargement des animaux..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 font-montserrat">
          Gestion des Animaux
        </h1>
      </div>

      {/* BARRE D'OUTILS */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="adopted">Adopté</option>
          <option value="foster_care">En FA</option>
          <option value="unavailable">Indisponible</option>
        </select>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Espèce</th>
              <th className="px-6 py-4">Refuge</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredAnimals.length > 0 ? (
              filteredAnimals.map((animal) => (
                <tr
                  key={animal.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {animal.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {animal.species?.name || "Inconnu"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {animal.shelter?.shelterProfile?.shelterName || "Inconnu"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={animal.deletedAt ? "Supprimé" : "Disponible"}
                      variant={animal.deletedAt ? "error" : "success"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {animal.deletedAt ? (
                      <button
                        type="button"
                        onClick={() => animal.id && handleRestore(animal.id)}
                        className="text-primary hover:bg-orange-50 p-2 rounded-full transition-colors inline-flex items-center gap-1"
                        title="Restaurer"
                      >
                        <RotateCcw className="w-4 h-4" /> Restaurer
                      </button>
                    ) : (
                      <>
                        <a
                          href={`/animaux/${animal.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-orange-50 transition-colors"
                          title="Voir la fiche publique"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => animal.id && handleDelete(animal.id)}
                          className="text-gray-400 hover:text-error hover:bg-red-50 p-2 rounded-full transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Aucun animal trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
