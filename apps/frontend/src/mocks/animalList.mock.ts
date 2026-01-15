import type { Animal } from "../../../../packages/shared-types/src/animal.schema";

// Type étendu pour l'affichage (simule une réponse API avec jointures)
type AnimalWithDetails = Animal & {
  species_name: string;
  shelter: {
    shelter_name: string;
    address: string;
  };
};

export const mockAnimalList: AnimalWithDetails[] = [
  {
    id: 1,
    name: "Max",
    age: "3 ans",
    sex: "male",
    weight: 28,
    height: 55,
    description:
      "Max est un Golden Retriever de 3 ans, plein de vie et d'affection. Il adore jouer, se promener et passer du temps avec sa famille. Très sociable, il s'entend à merveille avec les enfants et les autres animaux.",
    animal_status: "available",
    photos: [
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=1000&auto=format&fit=crop",
    ],
    accept_children: true,
    accept_other_animals: false,
    need_garden: true,
    treatment:
      "• Vacciné et stérilisé\n• Vermifugé régulièrement\n• Traitement anti-puces à jour",
    species_id: 1,
    pfc_user_id: 101,
    created_at: new Date(),
    species_name: "Chien",
    shelter: {
      shelter_name: "Refuge Les Amis à 4 Pattes",
      address: "Béthune, Hauts-de-France",
    },
  },
  {
    id: 2,
    name: "Luna",
    age: "2 ans",
    sex: "female",
    weight: 22,
    height: 50,
    description:
      "Luna est une chienne douce et curieuse. Elle adore les balades et les moments calmes à la maison. Elle conviendra parfaitement à une famille attentive.",
    animal_status: "available",
    photos: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop",
    ],
    accept_children: true,
    accept_other_animals: true,
    need_garden: false,
    treatment: "• Vaccinée\n• Stérilisée\n• Suivi vétérinaire régulier",
    species_id: 1,
    pfc_user_id: 101,
    created_at: new Date(),
    species_name: "Chien",
    shelter: {
      shelter_name: "Refuge Les Amis à 4 Pattes",
      address: "Béthune, Hauts-de-France",
    },
  },
  {
    id: 3,
    name: "Rocky",
    age: "5 ans",
    sex: "male",
    weight: 30,
    height: 60,
    description:
      "Rocky est un chien énergique qui a besoin de se dépenser. Il est très loyal et protecteur avec sa famille.",
    animal_status: "available",
    photos: [
      "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=1000&auto=format&fit=crop",
    ],
    accept_children: false,
    accept_other_animals: false,
    need_garden: true,
    treatment: "• Vacciné\n• Stérilisé\n• Aucun problème de santé connu",
    species_id: 1,
    pfc_user_id: 101,
    created_at: new Date(),
    species_name: "Chien",
    shelter: {
      shelter_name: "Refuge Les Amis à 4 Pattes",
      address: "Béthune, Hauts-de-France",
    },
  },
  {
    id: 4,
    name: "Milo",
    age: "1 an",
    sex: "male",
    weight: 18,
    height: 45,
    description:
      "Milo est encore jeune et plein d'énergie. Très joueur, il apprend vite et adore la compagnie humaine.",
    animal_status: "available",
    photos: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop",
    ],
    accept_children: true,
    accept_other_animals: true,
    need_garden: false,
    treatment: "• Vacciné\n• En cours de stérilisation\n• Suivi vétérinaire OK",
    species_id: 1,
    pfc_user_id: 101,
    created_at: new Date(),
    species_name: "Chien",
    shelter: {
      shelter_name: "Refuge Les Amis à 4 Pattes",
      address: "Béthune, Hauts-de-France",
    },
  },
];
