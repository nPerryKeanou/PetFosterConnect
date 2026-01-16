import type { ShelterProfile } from "@projet/shared-types";

export const mockShelters: ShelterProfile[] = [
  {
    pfc_user_id: 101,
    siret: "12345678901234",
    shelter_name: "Refuge Les Amis à 4 Pattes",
    description: "Un refuge engagé où chaque animal reçoit soins, amour et attention. Nous transformons des histoires difficiles en nouvelles vies heureuses, en reliant compagnons fidèles et familles prêtes à aimer.",
    created_at: new Date(),
    updated_at: null,
  },
  {
    pfc_user_id: 102,
    siret: "98765432109876",
    shelter_name: "Refuge de Lille",
    description: "Lieu d’espoir et de tendresse, notre refuge accueille animaux abandonnés avec chaleur. Nous offrons sécurité, soins et accompagnement, favorisant des adoptions responsables et des rencontres émouvantes entre humains et compagnons.",
    created_at: new Date(),
    updated_at: null,
  },
  {
      pfc_user_id: 103,
      siret: "98765432109096",
      shelter_name: "Refuge d'épernay",
      description: "Notre refuge incarne compassion et engagement. Chaque adoption est une promesse de bonheur partagé, chaque animal retrouve dignité et amour, chaque famille découvre un ami loyal et inoubliable.",
      created_at: new Date(),
      updated_at: null,
    },
];
