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
    pfc_user_id: 102,
    created_at: new Date(),
    species_name: "Chien",
    shelter: {
      shelter_name: "Refuge de Lille",
      address: "Lille, Hauts-de-France",
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
  {
    id: 5,
    name: "Nala",
    age: "2 ans",
    sex: "female",
    weight: 12,
    height: 40,
    description:
      "Nala est une chienne douce et affectueuse. Elle adore les câlins et s'entend très bien avec les enfants.",
    animal_status: "available",
    photos: [
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1000&auto=format&fit=crop",
    ],
    accept_children: true,
    accept_other_animals: true,
    need_garden: true,
    treatment: "• Vaccinée\n• Stérilisée\n• Suivi vétérinaire OK",
    species_id: 1,
    pfc_user_id: 103,
    created_at: new Date(),
    species_name: "Chien",
    shelter: {
      shelter_name: "Refuge d'épernay",
      address: "Epernay, Ardennes",
    },
  },
  {
    id: 6,
    name: "Oscar",
    age: "3 ans",
    sex: "male",
    weight: 5,
    height: 25,
    description:
      "Oscar est un chat joueur et curieux. Il aime explorer et se reposer au soleil.",
    animal_status: "available",
    photos: [
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1000&auto=format&fit=crop",
    ],
    accept_children: true,
    accept_other_animals: true,
    need_garden: false,
    treatment: "• Vacciné\n• Castré\n• Suivi vétérinaire OK",
    species_id: 2,
    pfc_user_id: 103,
    created_at: new Date(),
    species_name: "Chat",
    shelter: {
      shelter_name: "Refuge d'épernay",
      address: "Epernay, Ardennes",
    },
  },
];



