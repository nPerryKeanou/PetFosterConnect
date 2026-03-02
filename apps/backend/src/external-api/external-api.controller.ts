import { Controller, Get } from '@nestjs/common';
import { ExternalApiService } from './external-api.service';

@Controller('external') // Le préfixe /external utilisé dans le front
export class ExternalApiController {
  constructor(private readonly externalService: ExternalApiService) {}

  @Get('cats/breeds')
  getCats() {
    return this.externalService.getCatBreeds();
  }

  @Get('dogs/breeds')
  getDogs() {
    return this.externalService.getDogBreeds();
  }
}