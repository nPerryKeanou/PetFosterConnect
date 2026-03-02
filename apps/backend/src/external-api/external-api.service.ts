// apps/backend/src/external-api/external-api.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  constructor(private readonly httpService: HttpService) {}

  async getCatBreeds() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.thecatapi.com/v1/breeds', {
          headers: { 'x-api-key': process.env.CAT_API_KEY },
        }),
      );
      return data;
    } catch (error) {
      this.logger.error("Erreur lors de la récupération des races de chats", error);
      throw error;
    }
  }

  async getDogBreeds() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://api.thedogapi.com/v1/breeds', {
          headers: { 'x-api-key': process.env.DOG_API_KEY },
        }),
      );
      return data;
    } catch (error) {
      this.logger.error("Erreur lors de la récupération des races de chiens", error);
      throw error;
    }
  }
}