/**
 * 1. L'isolement: On commencepar créer mockPrisma. C'est crucial car on veut tester ton code du
 * fichier animals.service.ts tout seul, sans que les bigs éventuels de la base de données ne viennent polluer le résultat.
 * 
 * 2. L'injection : Dans beforEach, on "injecte" ce faux Prisma dans ton service. C'est la magie de NestJs : le service croit
 * qu'il parle à la base de données, mais il parle en fait à l'objet mockPrisma.
 * 
 * 3. Le scénarie (le 'it'): Je décide d'un scénario (ex: Je cherche l'animal n°1).
 *      Je prépare la réponse de la base de données (mockResolveldValue)
 *      Je lances l'action (serice.findOne(1))
 * 
 * 4. le verdict ( le expect ) : Je compare ce que le services m'a donné avec ce que j'attendais. Si
 * les deux correspondent, le test passe au VERT. Sinon, il passe au ROUGE et r'explique pourquoi (ex: "j'attendais rex et j'ai reç uundefined").
 * 
 * comment savoir si le test est bon ?
 * Si je changes volontairement le nom 'REex' par 'Félix' dans le expect mais que je laisse 'Rex' dans le mock, le test doit échouer.
 * C'est la preuve que le test surveille bien le code.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AnimalsService', () => {
    let service: AnimalsService; // On définit une variable pour stocker notre service
    let prisma: PrismaService; // On définit une variable pour stocker notre faux prisma

    // 1. Le simulateur (mock)
    // On crée un faux objet Prisma qui possède les m^mes fonctions que le vrai
    const mockPrisma = {
        animal: {
            // jest.fn() crée une fonction "espionne" qui ne fait rien par défaut
            findUnique: jest.fn(),
        },
    };

    //2. La mise en place (setup)
    // Cette partie s'éxecute avant chaque test('it)
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnimalsService, // On utilise le vrai code de ton service
                {
                    provide: PrismaService,
                    useValue: mockPrisma // On remplace le vrai prisma par notre simulateur
                },
            ],
        }).compile();

        // On récupère les instances pour les utiliser dans les test ci-dessous
        service = module.get<AnimalsService>(AnimalsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    // 3. Le test de récupération (succes)
    describe('findOne', () => {
        it('devrait retourner un animal spécifique avec son nom, sa race et son âge', async () => {

            // ÉTAPE A : Préparation de la "vérité" (données fictives)
            // On invente un animal tel que Prisma est censé le renvoyer
            const fakeAnimalFromDb = {
                id: 1,
                name: 'Res',
                age: 5,
                speceis: { name: 'Chien '}
            };

            // On dit au simulateur : "Quand le service t'appelle, réponds lui cet animal"
            mockPrisma.animal.findUnique.mockResolvedValue(fakeAnimalFromDb);

            // Étape 8 : Éxecution du code
            // On appelle la fonction de ton service que l'on veut tester
            const result = await service.findOne(1);

            // Étape C : vérification (Les assertions)
            // On vérifie que le resultats final correspond bien à ce qu'on a préparé
            expect(result.name).toBe('Rex');    //Le nom est-il correct ?
            expect(result.age).toBe(5);         // L'age est-il correct ?
            expect(result.species.name).toBe('Chien'); // La race est elle correcte ?

            // On vérifie aussi que le service a bien communiqué avec Prisma de la bonne manière
            expect(prisma.animal.findUnique).toHaveBeenCalledWith({
                where: { id: 1},
                include: expect.any(Object), // On vérifie qu'il a bien demandé les relations
            });
        });

        // 4. Le test d'erreur (cas où l'animal n'existe pas)
        it(`devrait lancer une erreur si l'animal n'est pas trouvé`, async () => {
            // On dit au simulateur de renvoyer "null" (ce que fait Prisma quand il ne trouve pas rien)
            mockPrisma.animal.findUnique.mockResolvedValue(null);

            // On vérifie que le service "explose" bien avec une erreur 404 (NotFound)
            // Note : On utilise une fonction fléchée () => ... car on attend que ça échoue
            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });
});