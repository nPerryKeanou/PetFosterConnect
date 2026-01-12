// Types partagés entre backend et frontend

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  REFUGE = 'REFUGE',
  FAMILLE_ACCUEIL = 'FAMILLE_ACCUEIL'
}

export interface Animal {
  id: number;
  nom: string;
  espece: Espece;
  age_annees?: number;
  description: string;
  statut: StatutAnimal;
}

export enum Espece {
  CHIEN = 'CHIEN',
  CHAT = 'CHAT',
  LAPIN = 'LAPIN',
  AUTRE = 'AUTRE'
}

export enum StatutAnimal {
  DISPONIBLE = 'DISPONIBLE',
  EN_COURS_PLACEMENT = 'EN_COURS_PLACEMENT',
  PLACE = 'PLACE',
  ADOPTE = 'ADOPTE',
  MASQUE = 'MASQUE'
}

export interface DemandeAccueil {
  id: number;
  animal_id: number;
  fa_id: number;
  message_motivation: string;
  statut: StatutDemande;
  date_demande: Date;
}

export enum StatutDemande {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE'
}
