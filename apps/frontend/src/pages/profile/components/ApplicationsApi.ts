import axios from "axios";
import type { Application, Animal } from "@projet/shared-types";
import api from "../../../api/api";

const API_URL = import.meta.env.VITE_API_URL;

type CandidateUser = {
  id: number;
  individualProfile?: {
    firstname?: string;
    lastname?: string;
  };
};

// Candidature enrichie avec l’animal uniquement
export type ApplicationWithAnimal = Application & {
  animal: Animal;
};

// Candidature enrichie avec animal + user
export type ApplicationWithRelations = Application & {
  animal: Animal;
  user: CandidateUser;
};

// Candidatures envoyées par le candidat
export async function getSentApplications(id:number): Promise<ApplicationWithRelations[]> {

    const res = await api.get(`${API_URL}/applications/sent/${id}`, {
    withCredentials:true
  });
  return res.data;
}

// Candidatures reçues par le refuge
export async function getReceivedApplications(id: number): Promise<ApplicationWithRelations[]> {
    const res = await api.get(`${API_URL}/applications/received/${id}`, {
    withCredentials:true
  });
  return res.data;
}


// Mise à jour du statut
export async function updateApplicationStatus(
  candidateId: number,
  animalId: number,
  status: "approved" | "rejected"
): Promise<Application> {
  const res = await axios.patch(
    `${API_URL}/applications/${animalId}/${candidateId}`,
    { applicationStatus: status }
  );
  return res.data;
}

// Archiver une candidature
export async function archiveApplication(
  candidateId: number,
  animalId: number
): Promise<Application> {
  const res = await axios.delete(
    `${API_URL}/applications/${animalId}/${candidateId}`
  );
  return res.data;

}
export async function acceptApplication(candidateId: number, animalId: number) {
  const res = await fetch(`${API_URL}/applications/${candidateId}/${animalId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de l'acceptation");
  return res.json();
}

export async function rejectApplication(candidateId: number, animalId: number) {
  const res = await fetch(`${API_URL}/applications/${candidateId}/${animalId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors du refus");
  return res.json();
}



