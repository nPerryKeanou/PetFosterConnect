// // Ce fichier sert à initialiser la base de données avec des données de test. 
// // Il permet de garantir que les tables obligatoires (Species, PfcUser) sont remplies 
// // pour tester les fonctionnalités du backend (CRUD Animal) sans erreurs de clés étrangères. 
// // Exécution : npx prisma db seed

// import { PrismaClient, UserRole, AnimalSex, AnimalStatus } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Nettoyage de la base de données...');
//   // On nettoie dans l'ordre inverse des relations pour éviter les erreurs de clés étrangères
//   await prisma.animal.deleteMany();
//   await prisma.species.deleteMany();
//   await prisma.pfcUser.deleteMany();

//   console.log('Création des données de base...');

//   // 1. Création des Espèces
//   const dog = await prisma.species.create({
//     data: { name: 'Chien' },
//   });
//   const cat = await prisma.species.create({
//     data: { name: 'Chat' },
//   });

// // 2. Création d'un Utilisateur Refuge (On garde l'ID 1 car ton code NestJS l'attend)
//   const shelter = await prisma.pfcUser.upsert({
//     where: { id: 1 },
//     update: {},
//     create: {
//       id: 1, 
//       email: 'contact@refuge-espoir.fr',
//       password: 'hash_password_ici',
//       role: UserRole.shelter,
//       shelter_profile: {
//         create: {
//           siret: '12345678901234',
//           shelter_name: 'Refuge de l’Espoir',
//         },
//       },
//     },
//   });

//   // 3. Création d'un Utilisateur Particulier (Laisse Prisma choisir l'ID !)
//   const individual = await prisma.pfcUser.upsert({
//     where: { email: 'jean.dupont@email.com' },
//     update: {},
//     create: {
//       email: 'jean.dupont@email.com',
//       password: 'hash_password_ici',
//       role: UserRole.individual,
//       individual_profile: {
//         create: {
//           housing_type: 'apartment',
//           surface: 65,
//         },
//       },
//     },
//   });

//   // 4. Création d'un premier Animal pour vérifier que le GET fonctionne
//   await prisma.animal.create({
//     data: {
//       name: 'Boby',
//       age: '3 ans',
//       sex: AnimalSex.male,
//       weight: 12.5,
//       height: 45,
//       description: 'Un petit chien dynamique et très câlin.',
//       animal_status: AnimalStatus.available,
//       species_id: dog.id,
//       pfc_user_id: shelter.id,
//       photos: [
//         'https://images.unsplash.com/photo-1517849845537-4d257902454a'
//       ] as any,
//       accept_children: true,
//       need_garden: false,
//     },
//   });

//   console.log('Seeding terminé !');
//   console.log(`- Espèces créées : 2`);
//   console.log(`- Refuge créé : ${shelter.email} (ID: ${shelter.id})`);
//   console.log(`- Particulier créé : ${individual.email}`);
// }

// main()
//   .catch((e) => {
//     console.error('Erreur lors du seeding:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });




import { PrismaClient, UserRole, AnimalSex, AnimalStatus, ApplicationType, ApplicationStatus, HousingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Lancement du Seed global haute fidélité...');

  // --- 1. NETTOYAGE TOTAL (Ordre strict pour les clés étrangères) ---
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.individualProfile.deleteMany();
  await prisma.shelterProfile.deleteMany();
  await prisma.species.deleteMany();
  await prisma.pfcUser.deleteMany();

  console.log('🧹 Base de données remise à zéro.');

  // --- 2. CRÉATION DES ESPÈCES ---
  const dog = await prisma.species.create({ data: { name: 'Chien' } });
  const cat = await prisma.species.create({ data: { name: 'Chat' } });
  const rabbit = await prisma.species.create({ data: { name: 'Lapin' } });

  // --- 3. CRÉATION D'UN REFUGE (User + ShelterProfile) ---
  const shelterUser = await prisma.pfcUser.create({
    data: {
      email: 'contact@refuge-spa.fr',
      password: 'hash_password_123',
      role: UserRole.shelter,
      phone_number: '0102030405',
      address: '123 Rue de la Protection, Paris',
      shelter_profile: {
        create: {
          siret: '12345678901234',
          shelter_name: 'SPA Paris',
          description: 'Refuge historique de protection animale.',
        },
      },
    },
  });

  // --- 4. CRÉATION D'UN PARTICULIER (User + IndividualProfile) ---
  const individualUser = await prisma.pfcUser.create({
    data: {
      email: 'jean.adopt@gmail.com',
      password: 'hash_password_456',
      role: UserRole.individual,
      individual_profile: {
        create: {
          housing_type: HousingType.house,
          surface: 100,
          have_garden: true,
          have_animals: false,
          have_children: true,
          available_family: true,
          available_time: 'Disponible les soirs et week-ends',
        },
      },
    },
  });

  // --- 5. CRÉATION D'ANIMAUX ---
  const animal1 = await prisma.animal.create({
    data: {
      name: 'Boby',
      age: '2 ans',
      sex: AnimalSex.male,
      weight: 25.5,
      height: 60,
      description: 'Un chien plein d\'énergie.',
      animal_status: AnimalStatus.available,
      species_id: dog.id,
      pfc_user_id: shelterUser.id,
      photos: ["https://images.unsplash.com/photo-1517849845537-4d257902454a"],
    },
  });

  const animal2 = await prisma.animal.create({
    data: {
      name: 'Luna',
      age: '6 mois',
      sex: AnimalSex.female,
      weight: 3.2,
      animal_status: AnimalStatus.available,
      species_id: cat.id,
      pfc_user_id: shelterUser.id,
    },
  });

  // --- 6. CRÉATION D'UNE DEMANDE D'ADOPTION (Application) ---
  await prisma.application.create({
    data: {
      pfc_user_id: individualUser.id,
      animal_id: animal1.id,
      message: 'Je souhaite adopter Boby car j\'ai un grand jardin.',
      application_type: ApplicationType.adoption,
      application_status: ApplicationStatus.pending,
    },
  });

  // --- 7. CRÉATION D'UN FAVORIS (Bookmark) ---
  await prisma.bookmark.create({
    data: {
      pfc_user_id: individualUser.id,
      animal_id: animal2.id,
    },
  });

  console.log('\n--- 📊 RÉCAPITULATIF POUR TES TESTS ---');
  console.log(`Refuge (Email: ${shelterUser.email}) ID : ${shelterUser.id}`);
  console.log(`Adoptant (Email: ${individualUser.email}) ID : ${individualUser.id}`);
  console.log(`Espèce (Chien) ID : ${dog.id}`);
  console.log(`Espèce (Chat) ID  : ${cat.id}`);
  console.log(`Animal (Boby) ID  : ${animal1.id}`);
  console.log('--------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Erreur Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });