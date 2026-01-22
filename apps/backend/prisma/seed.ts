import { 
  PrismaClient, 
  UserRole, 
  AnimalSex, 
  AnimalStatus, 
  HousingType, 
  ApplicationType, 
  ApplicationStatus,
  PfcUser,
  Animal 
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du Seed...');

  // 1. NETTOYAGE (Ordre inverse des dépendances pour éviter les erreurs FK)
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.individualProfile.deleteMany();
  await prisma.shelterProfile.deleteMany();
  await prisma.species.deleteMany();
  await prisma.pfcUser.deleteMany();

  // Hash du mot de passe par défaut (pour tous les comptes de test)
  const passwordHash = await argon2.hash('Password123!');

  // ===========================================================
  // 2. CRÉATION DES DONNÉES DE RÉFÉRENCE (ESPÈCES)
  // ===========================================================
  console.log('🐾 Création des Espèces...');
  const dog = await prisma.species.create({ data: { name: 'Chien' } });
  const cat = await prisma.species.create({ data: { name: 'Chat' } });
  const rabbit = await prisma.species.create({ data: { name: 'Lapin' } });
  const speciesList = [dog, cat, rabbit];


  // ===========================================================
  // 3. CRÉATION DE L'ADMIN
  // ===========================================================
  console.log('👑 Création de l\'Admin...');
  await prisma.pfcUser.create({
    data: {
      email: 'admin@petfoster.com',
      password: passwordHash,
      role: UserRole.admin,
      phoneNumber: '0100000000',
      address: 'Siège Pet Foster Connect, Paris',
    }
  });


  // ===========================================================
  // 4. CRÉATION DES REFUGES (SHELTERS)
  // ===========================================================
  console.log('🏢 Création des Refuges...');
  const shelters: PfcUser[] = [];
  const shelterData = [
    { name: 'SPA Paris', siret: '12345678900011', address: 'Gennevilliers, Île-de-France' },
    { name: 'Refuge Saint-Roch', siret: '12345678900012', address: 'Béthune, Hauts-de-France' },
    { name: 'L’Ami Fidèle', siret: '12345678900013', address: 'Lyon, Auvergne-Rhône-Alpes' },
    { name: 'Solana Protection', siret: '12345678900014', address: 'Marseille, Provence-Alpes-Côte d\'Azur' },
    { name: 'Le Repaire des Griffes', siret: '12345678900015', address: 'Nantes, Pays de la Loire' }
  ];

  for (const item of shelterData) {
    const s = await prisma.pfcUser.create({
      data: {
        email: `contact@${item.name.toLowerCase().replace(/\s|’|'/g, '-')}.fr`,
        password: passwordHash,
        role: UserRole.shelter,
        phoneNumber: '0102030405',
        address: item.address,
        shelterProfile: {
          create: {
            siret: item.siret,
            shelterName: item.name,
            description: `Bienvenue chez ${item.name}. Nous œuvrons pour le bien-être animal depuis plus de 10 ans.`,
            logo: `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`,
          }
        }
      }
    });
    shelters.push(s);
  }


  // ===========================================================
  // 5. CRÉATION DES FAMILLES (INDIVIDUALS)
  // ===========================================================
  console.log('🏠 Création des Familles...');
  const individuals: PfcUser[] = [];
  for (let i = 1; i <= 5; i++) {
    const ind = await prisma.pfcUser.create({
      data: {
        email: `famille.${i}@email.com`,
        password: passwordHash,
        role: UserRole.individual,
        phoneNumber: `060000000${i}`,
        address: `${i} rue des Lilas, 75000 Paris`,
        individualProfile: {
          create: {
            housingType: i % 2 === 0 ? HousingType.apartment : HousingType.house,
            surface: 40 + (i * 15),
            haveGarden: i % 2 !== 0, // Maison = Jardin
            haveAnimals: i > 2,
            haveChildren: i === 1 || i === 5,
            availableFamily: true,
            availableTime: "Disponible le soir en semaine et les week-ends pour de longues balades."
          }
        }
      }
    });
    individuals.push(ind);
  }


  // ===========================================================
  // 6. CRÉATION DES ANIMAUX
  // ===========================================================
  console.log('🐶 Création des Animaux...');
  const animalNames = [
    'Boby', 'Luna', 'Filou', 'Rex', 'Mimi', 'Oscar', 'Bella', 'Simba', 'Nala', 'Rocky',
    'Zoe', 'Max', 'Daisy', 'Jack', 'Lola', 'Pluto', 'Maya', 'Titi', 'Gribouille', 'Cookie',
    'Caramel', 'Nitro', 'Shadow', 'Praline', 'Pixel'
  ];

  const treatmentsList = [
    "Vaccins à jour. Traitement préventif contre les puces effectué le 10/01.",
    "Nécessite un nettoyage des oreilles une fois par semaine. Traitement otite en cours.",
    "Léger souffle au cœur, pas de traitement lourd mais éviter les efforts intenses.",
    "Régime alimentaire spécifique (croquettes hypoallergéniques).",
    "Aucun traitement en cours. En pleine forme !",
    "Stérilisation prévue le mois prochain."
  ];

  const createdAnimals: Animal[] = [];
  let animalIndex = 0;

  for (const shelter of shelters) {
    for (let i = 0; i < 5; i++) { // 5 animaux par refuge
      const currentName = animalNames[animalIndex];
      const species = speciesList[animalIndex % speciesList.length];
      
      // Image cohérente (Chien, Chat ou Lapin)
      const keyword = species.name.toLowerCase() === 'chien' ? 'dog' : 
                species.name.toLowerCase() === 'chat' ? 'cat' : 'rabbit';

      const photos = [
        `https://loremflickr.com/500/500/${keyword},pet?lock=${(animalIndex * 10) + 1}`,
        `https://loremflickr.com/500/500/${keyword},cute?lock=${(animalIndex * 10) + 2}`,
        `https://loremflickr.com/500/500/${keyword},animal?lock=${(animalIndex * 10) + 3}`
      ];

      const animal = await prisma.animal.create({
        data: {
          name: currentName,
          age: `${Math.floor(Math.random() * 10) + 1} ans`,
          sex: i % 2 === 0 ? AnimalSex.male : AnimalSex.female,
          weight: species.name === 'Chien' ? 15.5 : 4.2, // Decimal géré comme number en JS
          height: species.name === 'Chien' ? 55 : 25,
          description: `Voici ${currentName}, un adorable ${species.name.toLowerCase()} qui attend sa famille pour la vie. Très affectueux.`,
          
          animalStatus: AnimalStatus.available,
          photos: photos, // Tableau JSON
          
          // Critères de matching
          acceptOtherAnimals: i % 3 !== 0, // 2 sur 3 acceptent
          acceptChildren: true,
          needGarden: species.name === 'Chien' && i % 2 === 0, // 1 chien sur 2 a besoin d'un jardin

          treatment: treatmentsList[i % treatmentsList.length], // Ajout du champ treatment
          
          speciesId: species.id,
          pfcUserId: shelter.id // Lié au refuge
        }
      });
      createdAnimals.push(animal);
      animalIndex++;
    }
  }


  // ===========================================================
  // 7. CRÉATION DES FAVORIS (BOOKMARKS)
  // ===========================================================
  console.log('❤️ Création des Favoris...');
  // La famille 1 aime l'animal 1 et 2
  await prisma.bookmark.create({
    data: { pfcUserId: individuals[0].id, animalId: createdAnimals[0].id }
  });
  await prisma.bookmark.create({
    data: { pfcUserId: individuals[0].id, animalId: createdAnimals[1].id }
  });


  // ===========================================================
  // 8. CRÉATION DES DEMANDES (APPLICATIONS)
  // ===========================================================
  console.log('📝 Création des Demandes...');
  
  // Demande d'ADOPTION (En attente)
  await prisma.application.create({
    data: {
      pfcUserId: individuals[1].id, // Famille 2
      animalId: createdAnimals[2].id, // Animal 3
      message: "Bonjour, nous avons eu un coup de cœur pour cet animal. Nous vivons en maison.",
      applicationType: ApplicationType.adoption,
      applicationStatus: ApplicationStatus.pending
    }
  });

  // Demande de FA (Acceptée)
  await prisma.application.create({
    data: {
      pfcUserId: individuals[2].id, // Famille 3
      animalId: createdAnimals[3].id, // Animal 4
      message: "Je suis disponible pour accueillir cet animal le temps qu'il trouve une famille.",
      applicationType: ApplicationType.foster,
      applicationStatus: ApplicationStatus.approved
    }
  });

  // Demande REFUSÉE
  await prisma.application.create({
    data: {
      pfcUserId: individuals[3].id, // Famille 4
      animalId: createdAnimals[4].id, // Animal 5
      message: "Je le veux !",
      applicationType: ApplicationType.adoption,
      applicationStatus: ApplicationStatus.rejected
    }
  });

  console.log('✅ Seed terminé avec succès ! Base prête.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
