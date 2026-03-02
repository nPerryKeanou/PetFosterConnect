import api from "./api";

// On définit une interface pour avoir l'autocomplétion (TypeScript)
export interface ExternalBreed {
  id: number | string;
  name: string;
  image?: { url: string };
  breed_group?: string; // Spécifique aux chiens
  temperament?: string;
}

export const ExternalService = {
  // Appelle la route que tu as créée dans ton NestJS
  getCatBreeds: async (): Promise<ExternalBreed[]> => {
    const { data } = await api.get("/external/cats/breeds");
    return data;
  },

  // Appelle la route que tu as créée dans ton NestJS
  getDogBreeds: async (): Promise<ExternalBreed[]> => {
    const { data } = await api.get("/external/dogs/breeds");
    return data;
  }
};