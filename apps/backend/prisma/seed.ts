// Ce fichier sert à initialiser la base de données avec des données de test. 
// Il permet de garantir que les tables obligatoires (Species, PfcUser) sont remplies 
// pour tester les fonctionnalités du backend (CRUD Animal) sans erreurs de clés étrangères. 
// Exécution : npx prisma db seed

import { PrismaClient, UserRole, AnimalSex, AnimalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Nettoyage de la base de données...');
  // On nettoie dans l'ordre inverse des relations pour éviter les erreurs de clés étrangères
  await prisma.animal.deleteMany();
  await prisma.species.deleteMany();
  await prisma.pfcUser.deleteMany();

  console.log('Création des données de base...');

  // 1. Création des Espèces
  const dog = await prisma.species.create({
    data: { name: 'Chien' },
  });
  const cat = await prisma.species.create({
    data: { name: 'Chat' },
  });

// 2. Création d'un Utilisateur Refuge (On garde l'ID 1 car ton code NestJS l'attend)
  const shelter = await prisma.pfcUser.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, 
      email: 'contact@refuge-espoir.fr',
      password: 'hash_password_ici',
      role: UserRole.shelter,
      shelter_profile: {
        create: {
          siret: '12345678901234',
          shelter_name: 'Refuge de l’Espoir',
        },
      },
    },
  });

  // 3. Création d'un Utilisateur Particulier (Laisse Prisma choisir l'ID !)
  const individual = await prisma.pfcUser.upsert({
    where: { email: 'jean.dupont@email.com' },
    update: {},
    create: {
      email: 'jean.dupont@email.com',
      password: 'hash_password_ici',
      role: UserRole.individual,
      individual_profile: {
        create: {
          housing_type: 'apartment',
          surface: 65,
        },
      },
    },
  });

  // 4. Création d'un premier Animal pour vérifier que le GET fonctionne
  await prisma.animal.create({
    data: {
      name: 'Boby',
      age: '3 ans',
      sex: AnimalSex.male,
      weight: 12.5,
      height: 45,
      description: 'Un petit chien dynamique et très câlin.',
      animal_status: AnimalStatus.available,
      species_id: dog.id,
      pfc_user_id: shelter.id,
      photos: [
        'https://images.unsplash.com/photo-1517849845537-4d257902454a'
      ] as any,
      accept_children: true,
      need_garden: false,
    },
  });

  console.log('Seeding terminé !');
  console.log(`- Espèces créées : 2`);
  console.log(`- Refuge créé : ${shelter.email} (ID: ${shelter.id})`);
  console.log(`- Particulier créé : ${individual.email}`);
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });