import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Vérifie bien le chemin
import { DogAPiService } from 'src/dog-api/dog-api.service';

@Module({
  imports: [PrismaModule], // INDISPENSABLE
  controllers: [AnimalsController],
  providers: [
    AnimalsService,
    DogAPiService],
})
export class AnimalsModule {}



// import { Module } from '@nestjs/common';
// import { AnimalsService } from './animals.service';
// import { AnimalsController } from './animals.controller';

// @Module({
//   controllers: [AnimalsController],
//   providers: [AnimalsService],
// })
// export class AnimalsModule {}
