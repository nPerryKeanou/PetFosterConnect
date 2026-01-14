import type { Animal } from "@projet/shared-types";

// Type étendu pour l'affichage (simule une réponse API avec jointures)
type AnimalWithDetails = Animal & {
  species_name: string;
  shelter: {
    shelter_name: string;
    address: string;
  };
};

export const mockAnimal: AnimalWithDetails = {
  // Champs BDD (respect strict du schéma Zod)
  id: 1,
  name: "Max",
  age: "3 ans",
  sex: "male",
  weight: 28,
  height: 55,
  description: "Max est un Golden Retriever de 3 ans, plein de vie et d'affection. Il adore jouer, se promener et passer du temps avec sa famille. Très sociable, il s'entend à merveille avec les enfants et les autres animaux. Max a besoin d'un foyer avec un jardin où il pourra se dépenser. Il est à jour de ses vaccins et stérilisé.",
  
  animal_status: "available",
  
  photos: [
    "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1000&auto=format&fit=crop"
  ],

  // Critères de matching
  accept_children: true,
  accept_other_animals: false,
  need_garden: true,
  
  treatment: "• Vacciné et stérilisé\n• Vermifugé régulièrement\n• Traitement anti-puces à jour\n• Aucun traitement médical en cours",
  
  // Clés étrangères techniques
  species_id: 1,
  pfc_user_id: 101,
  
  // Dates obligatoires
  created_at: new Date(),

  // Champs UI simulés
  species_name: "Chien",
  shelter: {
    shelter_name: "Refuge Les Amis à 4 Pattes",
    address: "Béthune, Hauts-de-France"
  }
};