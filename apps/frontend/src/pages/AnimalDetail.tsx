import { Heart } from "lucide-react";
import BackBanner from "../components/ui/BackBanner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import CompatibilityBadge from "../components/ui/CompatibilityBadge";
import Input from "../components/ui/Input";
import { mockAnimal } from "../mocks/animal.mock";

export default function AnimalDetail() {
  const animal = mockAnimal;

  return (
    <div className="bg-bgapp font-openSans text-gray-800">
      <BackBanner to="/animaux" />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* SECTION PHOTOS */}
          <div className="space-y-6">
            
            {/* Photo principale */}
            <div className="relative rounded-xl overflow-hidden shadow-lg h-[500px] lg:h-[600px]">
              <img 
                src={animal.photos?.[0] ?? "https://placehold.co/600x600?text=Pas+de+photo"} 
                alt={animal.name} 
                className="w-full h-full object-cover object-center"
              />
              
              {/* Bouton favori*/}
              <button 
                className="absolute top-4 right-4 bg-white/90 p-3 rounded-full hover:bg-white transition text-error shadow-sm group" 
                type="button"
                aria-label="Ajouter aux favoris"
              >
                <Heart 
                  className="w-7 h-7 transition-all duration-300 group-hover:fill-error group-active:scale-90" 
                />
              </button>
            </div>

            {/* Galerie de miniatures*/}
            <div className="grid grid-cols-3 gap-4">
              {(animal.photos?.slice(1) ?? []).map((photo: string) => (
                <div key={photo} className="h-40 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <img 
                      src={photo} 
                      alt={`Vue détaillée`} 
                      className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                    />
                </div>
              ))}
            </div>
            
          </div>

          {/* SECTION INFORMATIONS */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm text-left flex flex-col items-start h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-2 w-full">
              <div>
                <h1 className="text-4xl font-bold font-montserrat text-black">{animal.name}</h1>
                <p className="text-lg text-gray-600">{animal.species_name}</p>
              </div>
              {animal.animalStatus === "available" && (
                <Badge label="Disponible" variant="success" />
              )}
            </div>

            {/* Infos générales */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">
                Informations Générales
              </h2>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>
                  <span className="font-semibold">Age :</span> {animal.age}
                </li>
                <li>
                  <span className="font-semibold">Sexe :</span>{" "}
                  {animal.sex === "male" ? "Mâle" : "Femelle"}
                </li>
                <li>
                  <span className="font-semibold">Taille :</span> {animal.height} cm
                </li>
                <li>
                  <span className="font-semibold">Poids :</span> {animal.weight} kg
                </li>
              </ul>
            </div>

            {/* A propos */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">
                A propos de {animal.name}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{animal.description}</p>
            </div>

            {/* Compatibilité */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-3 font-montserrat">Compatibilité</h2>
              <div className="flex flex-wrap gap-3 justify-start">
                <CompatibilityBadge label="Accepte enfants" isCompatible={animal.acceptChildren} />
                <CompatibilityBadge
                  label="Accepte animaux"
                  isCompatible={animal.acceptOtherAnimals}
                />
                <CompatibilityBadge
                  label={animal.needGarden ? "Jardin requis" : "Appartement OK"}
                  isCompatible={!animal.needGarden}
                />
              </div>
            </div>

            {/* Soins */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">
                Soins & Traitements
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{animal.treatment}</p>
            </div>

            {/* Refuge */}
            <div className="mt-6 mb-8 w-full">
              <h2 className="text-xl font-bold text-success mb-1 font-montserrat">Proposé par</h2>
              <p className="text-sm font-semibold text-gray-900">{animal.shelter.shelter_name}</p>
              <p className="text-xs text-gray-500">{animal.shelter.address}</p>
            </div>

            {/* Actions */}
            <div className="border-t-2 border-gray-300 pt-6 flex flex-col gap-4 w-full mt-auto">
              {/* Formulaire Adoption */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Adoption demandée !");
                }}
                className="flex items-start gap-4" // items-start pour aligner input et bouton en haut
              >
                <div className="flex-grow">
                  <Input
                    label="Message d'adoption" // Sera affiché ou caché selon ton choix
                    placeholder="Pourquoi souhaitez-vous adopter ?"
                    className="bg-white"
                  />
                </div>
                <div className="w-32 mt-[26px]">
                  {" "}
                  {/* Marge top pour compenser la hauteur du label */}
                  <Button variant="primary" fullWidth type="submit">
                    Adopter
                  </Button>
                </div>
              </form>

              {/* Formulaire Accueil */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Accueil demandé !");
                }}
                className="flex items-start gap-4"
              >
                <div className="flex-grow">
                  <Input
                    label="Message pour l'accueil"
                    placeholder="Vos disponibilités et motivations..."
                    className="bg-white"
                  />
                </div>
                <div className="w-32 mt-[26px]">
                  <Button variant="primary" fullWidth type="submit">
                    Accueillir
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
