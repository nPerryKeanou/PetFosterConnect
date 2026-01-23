import { useParams } from "react-router-dom";
import { useState } from "react";
import { CreateAnimalSchema } from "@projet/shared-types";
import { api } from "../../api/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function AnimalForm() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({
    name: "",
    age: "",
    description: "",
    sex: "unknown",
    weight: "",
    height: "",
    animalStatus: "available",
    photos: [],
    acceptOtherAnimals: false,
    acceptChildren: false,
    needGarden: false,
    treatment: "",
    speciesId: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = CreateAnimalSchema.parse(formData);
      const payload = { ...parsed, pfcUserId: Number(id) };

      const res = await api.post(`${API_URL}/animals`, payload, { withCredentials: true });
      if (!res) throw new Error("Erreur API");

      alert("Animal créé avec succès 🎉");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'animal");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Créer un animal</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-4">
            <div>
              <label>Nom</label>
              <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Âge</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Poids (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Taille (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Sexe</label>
              <select
                value={formData.sex}
                onChange={(e) => handleChange("sex", e.target.value)}
                className="border p-2 w-full"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <div>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Statut</label>
              <select
                value={formData.animalStatus}
                onChange={(e) => handleChange("animalStatus", e.target.value)}
                className="border p-2 w-full"
              >
                <option value="available">Disponible</option>
                <option value="adopted">Adopté</option>
                <option value="foster_care">Famille d'accueil</option>
                <option value="unavailable">Indisponible</option>
              </select>
            </div>

            <div>
              <label>Photos (URLs séparées par des virgules)</label>
              <input
                value={formData.photos}
                onChange={(e) =>
                  handleChange(
                    "photos",
                    e.target.value.split(",").map((url) => url.trim())
                  )
                }
                className="border p-2 w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="checkbox"
                  checked={formData.acceptOtherAnimals}
                  onChange={(e) => handleChange("acceptOtherAnimals", e.target.checked)}
                /> Accepte autres animaux
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.acceptChildren}
                  onChange={(e) => handleChange("acceptChildren", e.target.checked)}
                /> Accepte enfants
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.needGarden}
                  onChange={(e) => handleChange("needGarden", e.target.checked)}
                /> Besoin de jardin
              </label>
            </div>

            <div>
              <label>Traitement médical</label>
              <input
                value={formData.treatment}
                onChange={(e) => handleChange("treatment", e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>ID Espèce</label>
              <input
                type="number"
                value={formData.speciesId}
                onChange={(e) => handleChange("speciesId", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          </div>

          {/* Boutons en bas, sur toute la largeur */}
          <div className="md:col-span-2 flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
