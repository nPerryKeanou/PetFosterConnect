import { mockAnimal } from "../mocks/animal.mock";
import Badge from "../components/ui/Badge";
import CompatibilityBadge from "../components/ui/CompatibilityBadge";
import Button from "../components/ui/Button";
import BackBanner from "../components/ui/BackBanner";
import { Heart } from "lucide-react"; 

export default function AnimalDetail() {
  const animal = mockAnimal;

  return (
    <div className="bg-bgapp font-openSans text-gray-800">
      <BackBanner to="/animaux" />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SECTION PHOTOS */}
          <div className="space-y-4">
            {/* Photo principale */}
            <div className="relative rounded-lg overflow-hidden shadow-md h-[400px]">
              <img 
                src={animal.photos?.[0] ?? "https://placehold.co/600x400?text=Pas+de+photo"} 
                alt={animal.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Bouton favori */}
              <button 
                className="absolute top-4 right-4 bg-white/90 p-3 rounded-full hover:bg-white transition text-error shadow-sm group" 
                type="button"
                aria-label="Ajouter aux favoris"
              >
                <Heart 
                  className="w-6 h-6 transition-all duration-300 group-hover:fill-error group-active:scale-90" 
                />
              </button>
            </div>

            {/* Galerie miniatures */}
            <div className="grid grid-cols-3 gap-4">
              {(animal.photos?.slice(1) ?? []).map((photo) => ( // .slice(1) ignore le premier élément
                <img 
                  key={photo} 
                  src={photo} 
                  alt={`Vue détaillée`} 
                  className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                />
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
              {animal.animal_status === 'available' && (
                <Badge label="Disponible" variant="success" />
              )}
            </div>

            {/* Infos générales */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">Informations Générales</h2>
              <ul className="text-sm space-y-1 text-gray-700">
                <li><span className="font-semibold">Age :</span> {animal.age}</li>
                <li><span className="font-semibold">Sexe :</span> {animal.sex === 'male' ? 'Mâle' : 'Femelle'}</li>
                <li><span className="font-semibold">Taille :</span> {animal.height} cm</li>
                <li><span className="font-semibold">Poids :</span> {animal.weight} kg</li>
              </ul>
            </div>

            {/* A propos */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">A propos de {animal.name}</h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {animal.description}
              </p>
            </div>

            {/* Compatibilité */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-3 font-montserrat">Compatibilité</h2>
              <div className="flex flex-wrap gap-3 justify-start">
                <CompatibilityBadge 
                  label="Accepte enfants" 
                  isCompatible={animal.accept_children} 
                />
                <CompatibilityBadge 
                  label="Accepte animaux" 
                  isCompatible={animal.accept_other_animals} 
                />
                <CompatibilityBadge 
                  label={animal.need_garden ? "Jardin requis" : "Appartement OK"} 
                  isCompatible={!animal.need_garden} 
                />
              </div>
            </div>

            {/* Soins */}
            <div className="mt-6 w-full">
              <h2 className="text-xl font-bold text-success mb-2 font-montserrat">Soins & Traitements</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {animal.treatment}
              </p>
            </div>

            {/* Refuge */}
            <div className="mt-6 mb-8 w-full">
              <h2 className="text-xl font-bold text-success mb-1 font-montserrat">Proposé par</h2>
              <p className="text-sm font-semibold text-gray-900">{animal.shelter.shelter_name}</p>
              <p className="text-xs text-gray-500">{animal.shelter.address}</p>
            </div>

            {/* Actions */}
            <div className="border-t-2 border-gray-300 pt-6 flex flex-col gap-3 w-full mt-auto">
              {/* Formulaire Adoption */}
              <form 
                onSubmit={(e) => { e.preventDefault(); console.log("Adoption demandée !"); }}
                className="flex justify-between items-center gap-4"
              >
                <input 
                  type="text" 
                  placeholder="Votre message..."
                  className="h-10 flex-grow border-2 border-gray-300 rounded px-3"
                />
                <div className="w-32">
                    <Button variant="primary" fullWidth type="submit">Adopter</Button>
                </div>
              </form>

              {/* Formulaire Accueil */}
              <form className="flex justify-between items-center gap-4">
                <input 
                  type="text" 
                  placeholder="Votre message..."
                  className="h-10 flex-grow border-2 border-gray-300 rounded px-3"
                />
                <div className="w-32">
                    <Button variant="primary" fullWidth type="submit">Accueillir</Button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}