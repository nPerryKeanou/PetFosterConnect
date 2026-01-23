import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import BackBanner from "../components/ui/BackBanner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import CompatibilityBadge from "../components/ui/CompatibilityBadge";
import Input from "../components/ui/Input";
import { useAuth } from "../auth/authContext"; // ✅ pour récupérer user

export default function AnimalDetail() {
  const { userId, id } = useParams<{ userId: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ utilisateur connecté

  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/animals/${id}`, {
          credentials: "include"
        });
        const data = await response.json();
        setAnimal(data);

        if (data.isBookmarked !== undefined) setIsFavorite(data.isBookmarked);
        if (data.photos?.length > 0) setSelectedPhoto(data.photos[0]);
      } catch (error) {
        console.error("Erreur chargement animal:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAnimal();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:3001/bookmarks/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId: Number(id) }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.bookmarked);
      } else if (response.status === 401) {
        alert("Vous devez être connecté pour ajouter des favoris !");
      }
    } catch (error) {
      console.error("Erreur toggle favori:", error);
    }
  };

  if (loading) return <div className="text-center p-20">Chargement...</div>;
  if (!animal) return <div className="text-center p-20">Animal non trouvé.</div>;

  const photoArray = Array.isArray(animal.photos) ? animal.photos : [];

  // ✅ Vérifie si refuge connecté est propriétaire
    const isShelterOwner =
      user?.role === "shelter" &&
      Number(user?.id) === Number(userId) && (
        // si le backend renvoie bien pfcUserId, on compare
        animal.shelter?.pfcUserId
          ? Number(animal.shelter.pfcUserId) === Number(userId)
          // sinon on se contente de comparer userId de l’URL avec l’utilisateur connecté
          : true
      );
    
    
  console.log("user.id:", user?.id);
  console.log("userId (URL):", userId);
  console.log("animal.shelter.pfcUserId:", animal.shelter?.pfcUserId);
  console.log("isShelterOwner:", isShelterOwner);
  
    
    

  return (
    <div className="bg-bgapp font-openSans text-gray-800">
      {/* BackBanner visible uniquement pour les visiteurs */}
      {!isShelterOwner && <BackBanner to="/animaux" />}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SECTION PHOTOS */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg h-[500px] lg:h-[600px] bg-gray-200">
              <img 
                src={selectedPhoto || (Array.isArray(animal.photos) ? animal.photos[0] : "https://placehold.co/600x600")} 
                alt={animal.name} 
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Bouton favori */}
              <button 
                className="absolute top-4 right-4 bg-white/90 p-3 rounded-full hover:bg-white transition shadow-md group" 
                type="button"
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart 
                  className={`w-7 h-7 transition-all duration-300 ${
                    isFavorite 
                    ? "fill-error text-error scale-110" 
                    : "text-gray-400 group-hover:text-error"
                  }`} 
                />
              </button>
            </div>
  
            {/* Miniatures */}
            <div className="grid grid-cols-4 gap-4">
              {photoArray.map((photo: string, index: number) => (
                <button 
                  key={index} 
                  onClick={() => setSelectedPhoto(photo)}
                  className={`h-24 rounded-lg overflow-hidden border-4 transition-all ${selectedPhoto === photo ? 'border-success scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={photo} alt={`Miniature ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
  
          {/* SECTION INFORMATIONS */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm text-left flex flex-col items-start h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-2 w-full">
              <div>
                <h1 className="text-4xl font-bold font-montserrat text-black">{animal.name}</h1>
                <p className="text-lg text-gray-600">{animal.species.name}</p>
              </div>
              {animal.animalStatus === "available" && (
                <Badge label="Disponible" variant="success" />
              )}
            </div>
  
            {/* Infos générales */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">Informations Générales</h2>
              <ul className="text-sm space-y-1 text-gray-700">
                <li><span className="font-semibold">Age :</span> {animal.age} ans</li>
                <li><span className="font-semibold">Sexe :</span> {animal.sex === "male" ? "Mâle" : "Femelle"}</li>
                <li><span className="font-semibold">Taille :</span> {animal.height} cm</li>
                <li><span className="font-semibold">Poids :</span> {animal.weight} kg</li>
              </ul>
            </div>
  
            {/* A propos */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">A propos de {animal.name}</h2>
              <p className="text-sm leading-relaxed text-gray-700">{animal.description}</p>
            </div>
  
            {/* Compatibilité */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-3 font-montserrat">Compatibilité</h2>
              <div className="flex flex-wrap gap-3 justify-start">
                <CompatibilityBadge label="Accepte enfants" isCompatible={animal.acceptChildren} />
                <CompatibilityBadge label="Accepte animaux" isCompatible={animal.acceptOtherAnimals} />
                <CompatibilityBadge label={animal.needGarden ? "Jardin requis" : "Appartement OK"} isCompatible={!animal.needGarden} />
              </div>
            </div>
  
            {/* Soins */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">Soins & Traitements</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{animal.treatment}</p>
            </div>
  
            {/* Refuge */}
            <div className="mt-6 mb-8 w-full">
              <h2 className="text-xl font-bold text-success mb-1 font-montserrat">Proposé par</h2>
              <p className="text-sm font-semibold text-gray-900">
                {animal.shelter?.shelterProfile?.shelterName || "Refuge partenaire"}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Adresse :</span> {animal.shelter?.address || "Non communiquée"}
              </p>
            </div>
  
            {/* Actions */}
            <div className="border-t-2 border-gray-300 pt-6 flex flex-col gap-4 w-full mt-auto">
              {isShelterOwner ? (
                <Button
                  variant="primary"
                  onClick={() => navigate(`/user/${user?.id}/profil/animaux/creer`, { state: { animal } })}
                >
                  Modifier
                </Button>
              ) : (
                <>
                  {/* Formulaire Adoption */}
                  <form onSubmit={(e) => { e.preventDefault(); console.log("Adoption demandée !"); }} className="flex items-start gap-4">
                    <div className="flex-grow">
                      <Input label="Message d'adoption" placeholder="Pourquoi souhaitez-vous adopter ?" className="bg-white" />
                    </div>
                    <div className="w-32 mt-[26px]">
                      <Button variant="primary" fullWidth type="submit">Adopter</Button>
                    </div>
                  </form>
  
                  {/* Formulaire Accueil */}
                  <form onSubmit={(e) => { e.preventDefault(); console.log("Accueil demandé !"); }} className="flex items-start gap-4">
                    <div className="flex-grow">
                      <Input label="Message pour l'accueil" placeholder="Vos disponibilités et motivations..." className="bg-white" />
                    </div>
                    <div className="w-32 mt-[26px]">
                      <Button variant="primary" fullWidth type="submit">Accueillir</Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}