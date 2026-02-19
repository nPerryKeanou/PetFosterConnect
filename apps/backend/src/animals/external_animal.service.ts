import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalAnimalsService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Récupère les chiens et les chats en parallèle et les fusionne
   */
  async getExternalAnimals() {
    try {
      // Promise.all lance les deux requêtes en même temps pour gagner du temps
      //Si tu es sûr à 100 % que tes clés sont dans ton .env, ajoute un ! après la variable. Cela dit à TypeScript : "Fais-moi confiance, je sais qu'elle existe". process.env.DOGAPI_API_KEY!
      const [dogs, cats] = await Promise.all([
        this.fetchFromApi('https://api.thedogapi.com/v1/breeds?limit=10', process.env.DOGAPI_API_KEY || "", 'Chien'),
        this.fetchFromApi('https://api.thecatapi.com/v1/breeds?limit=10', process.env.CATAPI_API_KEY || "", 'Chat')
      ]);

      // On combine les deux tableaux en un seul
      return [...dogs, ...cats];
    } catch (error) {
      console.error("❌ Erreur lors de l'appel aux APIs externes:", error.message);
      // On renvoie un tableau vide pour ne pas faire planter l'application
      return [];
    }
  }

  /**
   * Méthode générique pour appeler une API (Dog ou Cat) et formater les données
   */
  private async fetchFromApi(url: string, apiKey: string, speciesName: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: { 'x-api-key': apiKey },
      })
    );

    // On transforme (map) le format de l'API vers TON format d'application
    return data.map((animal: any) => ({
      // On ajoute un préfixe pour être sûr que l'ID ne soit pas le même qu'en BDD
      id: `ext-${speciesName.toLowerCase()}-${animal.id}`,
      name: animal.name,
      // On simule la structure de ton include Prisma { species: { name: '...' } }
      species: { 
        name: speciesName 
      },
      // Les APIs utilisent life_span pour la durée de vie, on s'en sert pour l'âge
      age: animal.life_span,
      // On récupère l'image si elle existe, sinon un placeholder
      photos: animal.image?.url ? [animal.image.url] : ['https://via.placeholder.com/300'],
      description: `Tempérament: ${animal.temperament || 'Non renseigné'}.`,
      location: 'Partenaire Externe',
    }));
  }
}