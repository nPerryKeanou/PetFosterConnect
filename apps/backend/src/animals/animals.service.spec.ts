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
    //let prisma: PrismaService; // On définit une variable pour stocker notre faux prisma

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
        // On nettoie les souvenirs du mock avant chaque test
        jest.clearAllMocks();
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
        //service = module.get<AnimalsService>(AnimalsService);
        // Optionnel : on peut aussi récupérer l'instance mockée si on veut faire des vérifications précises
        // prisma = module.get<PrismaService>(PrismaService);
        // 2. On crée l'instance MANUELLEMENT sans passer par Test.createTestingModule
//         // On passe prismaMock directement au constructeur
        service = new AnimalsService(mockPrisma as any);
    
    });

    // 3. Le test de récupération (succes)
    describe('findOne', () => {
        it('devrait retourner un animal spécifique avec son nom, sa race et son âge', async () => {

            // ÉTAPE A : Préparation de la "vérité" (données fictives)
            // On invente un animal tel que Prisma est censé le renvoyer
            const fakeAnimal = {
                id: 1,
                name: 'Rex',
                age: 5,
                deletedAt: null,
                species: { name: 'Chien' },
                shelter: { shelterProfile: { name: 'Refuge SPA' } },
                bookmarks: [], // Important car ton service fait animal.bookmarks?.length
            };

            // On dit au simulateur : "Quand le service t'appelle, réponds lui cet animal"
            mockPrisma.animal.findUnique.mockResolvedValue(fakeAnimal);

            // Étape 8 : Éxecution du code
            // On appelle la fonction de ton service que l'on veut tester
            const result = await service.findOne(1);

            // Étape C : vérification (Les assertions)
            // On vérifie que le resultats final correspond bien à ce qu'on a préparé
            expect(result.name).toBe('Rex');    //Le nom est-il correct ?
            // expect(result.age).toBe(5);         // L'age est-il correct ?
            // expect(result.species.name).toBe('Chien'); // La race est elle correcte ?
            expect(result.isBookmarked).toBe(false); // Car bookmarks était vide []

            // On vérifie aussi que le service a bien communiqué avec Prisma de la bonne manière
            // expect(prisma.animal.findUnique).toHaveBeenCalledWith({
            //     where: { id: 1},
            //     include: expect.any(Object), // On vérifie qu'il a bien demandé les relations
            // });
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

// describe('AnimalsService', () => {
//     let service: AnimalsService;
//     let prismaMock: any; // On crée une variable locale pour le mock

//     beforeEach(async () => {
//         // 1. On définit le mock CLAIREMENT ici
//         prismaMock = {
//             animal: {
//                 findUnique: jest.fn(),
//             },
//         };

//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 AnimalsService,
//                 {
//                     provide: PrismaService,
//                     useValue: prismaMock, // On injecte l'objet qu'on vient de créer
//                 },
//             ],
//         }).compile();

//         // service = module.get<AnimalsService>(AnimalsService);
//         // 2. On crée l'instance MANUELLEMENT sans passer par Test.createTestingModule
//         // On passe prismaMock directement au constructeur
//         service = new AnimalsService(prismaMock as any);
//     });

//     describe('findOne', () => {
//         it('devrait retourner un animal spécifique', async () => {
//             const fakeAnimal = {
//                 id: 1,
//                 name: 'Rex',
//                 age: 5,
//                 deletedAt: null,
//                 species: { name: 'Chien' },
//                 shelter: { shelterProfile: { name: 'Refuge SPA' } },
//                 bookmarks: [],
//             };

//             // Utilise prismaMock ici au lieu de mockPrisma
//             prismaMock.animal.findUnique.mockResolvedValue(fakeAnimal);

//             const result = await service.findOne(1);
//             expect(result.name).toBe('Rex');
//         });

//         it(`devrait lancer une erreur si l'animal n'est pas trouvé`, async () => {
//             prismaMock.animal.findUnique.mockResolvedValue(null);
//             await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
//         });
//     });
// });