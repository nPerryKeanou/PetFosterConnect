import { useParams ,useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { CreateAnimalSchema } from "@projet/shared-types";
import { api } from "../../api/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function AnimalForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);

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

  // Charger les espèces
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await fetch(`${API_URL}/species`);
        const data = await res.json();
        setSpecies(data);
      } catch (err) {
        console.error("Erreur chargement espèces:", err);
      }
    };
    fetchSpecies();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Conversion finale AVANT Zod
    const parsedData = {
      ...formData,
      age: formData.age, // reste une string
      weight: formData.weight === "" ? undefined : Number(formData.weight),
      height: formData.height === "" ? undefined : Number(formData.height),
      speciesId: formData.speciesId === "" ? undefined : Number(formData.speciesId),
    };

    try {
      const parsed = CreateAnimalSchema.parse(parsedData);

      const payload = { ...parsed, pfcUserId: Number(id) };

      await api.post(`/animals`, payload);

      alert("Animal créé avec succès 🎉");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'animal (voir console)");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Créer un animal</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COLONNE GAUCHE */}
          <div className="space-y-4">

            <div>
              <label>Nom *</label>
              <input
                type="text"
                required
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
                onChange={(e) => handleChange("age", e.target.value)} // PAS Number()
                className="border p-2 w-full"
              />
              
            </div>

            <div>
              <label>Poids (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) =>
                  handleChange("weight", e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Taille (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  handleChange("height", e.target.value === "" ? "" : Number(e.target.value))
                }
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
                <option value="unknown">Inconnu</option>
              </select>
            </div>

          </div>

          {/* COLONNE DROITE */}
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
              <label>Espèce *</label>
              <select
                required
                value={formData.speciesId}
                onChange={(e) =>
                  handleChange("speciesId", e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border p-2 w-full"
              >
                <option value="">-- Sélectionner une espèce --</option>
                {species.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
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
                />  Ok autres animaux
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={formData.acceptChildren}
                  onChange={(e) => handleChange("acceptChildren", e.target.checked)}
                />  Ok enfants
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

          </div>

          {/* BOUTONS */}
          <div className="md:col-span-2 flex justify-between mt-6">
            <button type="button" onClick={() => navigate(-1)} 
            className="bg-gray-400 text-white px-4 py-2 rounded" > 
            Annuler 
            </button>

            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
              Sauvegarder
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
