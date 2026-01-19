import { PrismaClient, UserRole, AnimalSex, AnimalStatus, ApplicationType, ApplicationStatus, HousingType, Species, PfcUser } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Lancement du Seed "Mega" (5 Refuges x 5 Animaux = 25 total)...');

  // --- 1. NETTOYAGE ---
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.individualProfile.deleteMany();
  await prisma.shelterProfile.deleteMany();
  await prisma.species.deleteMany();
  await prisma.pfcUser.deleteMany();

  // --- 2. ESPÈCES ---
  const dog = await prisma.species.create({ data: { name: 'Chien' } });
  const cat = await prisma.species.create({ data: { name: 'Chat' } });
  const rabbit = await prisma.species.create({ data: { name: 'Lapin' } });
  const speciesList: Species[] = [dog, cat, rabbit];

  // --- 3. REFUGES (5) ---
  const shelterNames = ['SPA Paris', 'Refuge Saint-Roch', 'L’Ami Fidèle', 'Solana Protection', 'Le Repaire des Griffes'];
  const shelters: PfcUser[] = [];
  
  for (let i = 0; i < 5; i++) {
    const s = await prisma.pfcUser.create({
      data: {
        email: `contact@refuge-${i + 1}.fr`,
        password: 'password123',
        role: UserRole.shelter,
        shelter_profile: {
          create: {
            siret: `1234567890001${i}`,
            shelter_name: shelterNames[i],
            description: `Bienvenue au refuge ${shelterNames[i]}. Nous prenons soin de nos pensionnaires avec amour.`,
          },
        },
      },
    });
    shelters.push(s);
  }

  // --- 4. FAMILLES (5) ---
  for (let i = 1; i <= 5; i++) {
    await prisma.pfcUser.create({
      data: {
        email: `famille.${i}@email.com`,
        password: 'password123',
        role: UserRole.individual,
        individual_profile: {
          create: {
            housing_type: i % 2 === 0 ? HousingType.apartment : HousingType.house,
            surface: 50 + (i * 15),
            available_family: true,
          },
        },
      },
    });
  }

  // --- 5. ANIMAUX (25 total : 5 par refuge) ---
  const rawData = [
    { name: 'Boby', desc: 'Très doux, adore jouer avec les enfants.', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a' },
    { name: 'Luna', desc: 'Indépendante et calme, cherche un foyer paisible.', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba' },
    { name: 'Filou', desc: 'Petit lapin énergique qui adore les carottes.', img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308' },
    { name: 'Rex', desc: 'Un compagnon fidèle pour de longues randonnées.', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e' },
    { name: 'Mimi', desc: 'Une petite boule de poils très câline.', img: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d' },
  ];

  for (let sIndex = 0; sIndex < shelters.length; sIndex++) {
    const currentShelter = shelters[sIndex];
    
    for (let aIndex = 0; aIndex < 5; aIndex++) {
      const data = rawData[aIndex]; // On boucle sur nos 5 types d'animaux de base
      const species = speciesList[aIndex % speciesList.length]; // Alterne Chien/Chat/Lapin

      await prisma.animal.create({
        data: {
          name: `${data.name} (du refuge ${sIndex + 1})`,
          age: `${Math.floor(Math.random() * 8) + 1} ans`,
          sex: aIndex % 2 === 0 ? AnimalSex.male : AnimalSex.female,
          weight: species.name === 'Chien' ? 20.5 : 3.5,
          description: data.desc,
          animal_status: AnimalStatus.available,
          photos: [data.img],
          species_id: species.id,
          pfc_user_id: currentShelter.id,
        },
      });
    }
  }

  console.log('✅ Base de données prête : 5 refuges, 5 familles, 25 animaux !');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());