import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { CreateAnimalSchema } from "@projet/shared-types";
import api from "../../api/api"; // ✅ Import par défaut sans {}
import { toast } from "react-toastify";

export default function AnimalForm() {
  const { id } = useParams<{ id: string }>(); // pfcUserId du refuge
  const navigate = useNavigate();
  const location = useLocation();
  const animal = location.state?.animal;

  const [species, setSpecies] = useState<{ id: number; name: string }[]>([]);

  const [formData, setFormData] = useState<any>({
    name: animal?.name ?? "",
    age: animal?.age ?? "",
    description: animal?.description ?? "",
    sex: animal?.sex ?? "unknown",
    weight: animal?.weight ?? "",
    height: animal?.height ?? "",
    animalStatus: animal?.animalStatus ?? "available",
    photos: animal?.photos ?? [],
    acceptOtherAnimals: animal?.acceptOtherAnimals ?? false,
    acceptChildren: animal?.acceptChildren ?? false,
    needGarden: animal?.needGarden ?? false,
    treatment: animal?.treatment ?? "",
    speciesId: animal?.species?.id ?? "",
  });

  // ✅ Chargement des espèces via l'instance api
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await api.get("/species");
        setSpecies(res.data);
      } catch (err) {
        console.error("Erreur chargement espèces:", err);
        toast.error("Impossible de charger les espèces.");
      }
    };
    fetchSpecies();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedData = {
      ...formData,
      weight: formData.weight === "" ? undefined : Number(formData.weight),
      height: formData.height === "" ? undefined : Number(formData.height),
      speciesId: formData.speciesId === "" ? undefined : Number(formData.speciesId),
    };

    try {
      // Validation Zod
      const validatedData = CreateAnimalSchema.parse(parsedData);

      if (animal) {
        // Mode édition → PATCH
        await api.patch(`/animals/${animal.id}`, validatedData);
        toast.success("Animal modifié avec succès 🎉");
      } else {
        // Mode création → POST
        const payload = { ...validatedData, pfcUserId: Number(id) };
        await api.post(`/animals`, payload);
        toast.success("Animal créé avec succès 🎉");
      }

      navigate(-1);
    } catch (err: any) {
      console.error(err);
      
      // ✅ Gestion fine des erreurs
      if (err.name === "ZodError") {
        // Affiche chaque erreur de validation Zod
        err.issues.forEach((issue: any) => {
          toast.error(`${issue.path[0]}: ${issue.message}`);
        });
      } else if (err.response) {
        // Erreur API (400, 500, etc.)
        const message = err.response.data?.message || "Erreur serveur";
        toast.error(message);
      } else {
        toast.error("Une erreur inattendue est survenue.");
      }
    }
  };

  return (
    <div className="bg-bgapp font-openSans text-gray-800 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SECTION PHOTOS */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px] bg-gray-200">
              <img
                src={formData.photos[0] || "https://placehold.co/600x600?text=Aperçu+Photo"}
                alt={formData.name || "Nouvel animal"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-semibold mb-2">Photos (URLs séparées par des virgules)</label>
              <textarea
                value={Array.isArray(formData.photos) ? formData.photos.join(", ") : ""}
                onChange={(e) =>
                  handleChange(
                    "photos",
                    e.target.value.split(",").map((url) => url.trim()).filter(url => url !== "")
                  )
                }
                placeholder="https://image1.jpg, https://image2.jpg"
                className="border p-2 w-full rounded focus:border-primary outline-none"
                rows={3}
              />
            </div>
          </div>

          {/* SECTION INFORMATIONS */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm text-left flex flex-col items-start min-h-[600px]">
            
            <div className="mb-6 w-full space-y-3">
              <h2 className="text-2xl font-bold text-secondary mb-4 font-montserrat border-b pb-2">
                {animal ? "Modifier l'animal" : "Ajouter un compagnon"}
              </h2>
              
              <label className="block text-sm font-semibold">Nom de l'animal</label>
              <input type="text" placeholder="Ex: Rex" value={formData.name} onChange={(e)=>handleChange("name",e.target.value)} className="border p-2 w-full rounded shadow-sm"/>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Âge</label>
                  <input type="text" placeholder="Ex: 2 ans" value={formData.age} onChange={(e)=>handleChange("age",e.target.value)} className="border p-2 w-full rounded shadow-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold">Sexe</label>
                  <select value={formData.sex} onChange={(e)=>handleChange("sex",e.target.value)} className="border p-2 w-full rounded shadow-sm">
                    <option value="male">Mâle</option>
                    <option value="female">Femelle</option>
                    <option value="unknown">Inconnu</option>
                  </select>
                </div>
              </div>

              <label className="block text-sm font-semibold">Espèce</label>
              <select value={formData.speciesId} onChange={(e)=>handleChange("speciesId", e.target.value)} className="border p-2 w-full rounded shadow-sm">
                <option value="">-- Sélectionner une espèce --</option>
                {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <label className="block text-sm font-semibold">Statut actuel</label>
              <select value={formData.animalStatus} onChange={(e)=>handleChange("animalStatus",e.target.value)} className="border p-2 w-full rounded shadow-sm">
                <option value="available">Disponible</option>
                <option value="adopted">Adopté</option>
                <option value="foster_care">Famille d'accueil</option>
                <option value="unavailable">Indisponible</option>
              </select>
            </div>

            {/* Caractéristiques physiques */}
            <div className="mb-6 w-full grid grid-cols-2 gap-4">
              <div className="col-span-2"><h3 className="font-bold text-success font-montserrat">Physique</h3></div>
              <div>
                <label className="block text-xs text-gray-500 uppercase">Poids (kg)</label>
                <input type="number" step="0.1" value={formData.weight} onChange={(e)=>handleChange("weight",e.target.value)} className="border p-2 w-full rounded shadow-sm"/>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase">Taille (cm)</label>
                <input type="number" value={formData.height} onChange={(e)=>handleChange("height",e.target.value)} className="border p-2 w-full rounded shadow-sm"/>
              </div>
            </div>

            {/* Compatibilité */}
            <div className="mb-6 w-full space-y-2">
              <h3 className="font-bold text-success font-montserrat">Compatibilité</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border shadow-sm">
                  <input type="checkbox" checked={formData.acceptChildren} onChange={(e)=>handleChange("acceptChildren",e.target.checked)} className="accent-primary" />
                  <span>Ok enfants</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border shadow-sm">
                  <input type="checkbox" checked={formData.acceptOtherAnimals} onChange={(e)=>handleChange("acceptOtherAnimals",e.target.checked)} className="accent-primary" />
                  <span>Ok animaux</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border shadow-sm">
                  <input type="checkbox" checked={formData.needGarden} onChange={(e)=>handleChange("needGarden",e.target.checked)} className="accent-primary" />
                  <span>Besoin jardin</span>
                </label>
              </div>
            </div>

            {/* Santé & Description */}
            <div className="mb-6 w-full space-y-3">
              <h3 className="font-bold text-success font-montserrat">Santé & Histoire</h3>
              <label className="block text-sm font-semibold">Soins (stérilisation, vaccins...)</label>
              <input type="text" placeholder="Ex: Pucé, vacciné, castré" value={formData.treatment} onChange={(e)=>handleChange("treatment",e.target.value)} className="border p-2 w-full rounded shadow-sm"/>
              
              <label className="block text-sm font-semibold mt-2">Description / Histoire</label>
              <textarea 
                value={formData.description} 
                onChange={(e)=>handleChange("description",e.target.value)} 
                className="border p-2 w-full rounded shadow-sm h-32 outline-none focus:border-primary"
                placeholder="Racontez son histoire..."
              />
            </div>

            {/* Boutons */}
            <div className="border-t border-gray-300 pt-6 flex justify-between w-full mt-auto">
              <button type="button" onClick={()=>navigate(-1)} className="text-gray-500 hover:text-gray-800 font-semibold px-4 py-2 transition">
                Annuler
              </button>
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-2 rounded-full shadow-lg transition transform hover:scale-105">
                Sauvegarder la fiche
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}