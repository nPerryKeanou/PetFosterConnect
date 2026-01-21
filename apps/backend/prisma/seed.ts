import { 
  PrismaClient, 
  UserRole, 
  AnimalSex, 
  AnimalStatus, 
  HousingType, 
  Species, 
  PfcUser 
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.individualProfile.deleteMany();
  await prisma.shelterProfile.deleteMany();
  await prisma.species.deleteMany();
  await prisma.pfcUser.deleteMany();

  // --- 1. CRÉATION DES ESPÈCES ---
  const dog = await prisma.species.create({ data: { name: 'Chien' } });
  const cat = await prisma.species.create({ data: { name: 'Chat' } });
  const speciesList = [dog, cat];
  
  // --- 2. CRÉATION DE 5 REFUGES ---
  const shelters: PfcUser[] = [];
  const shelterData = [
    { name: 'SPA Paris', siret: '12345678900011', address: '39 Boulevard Berthier, 75017 Paris' },
    { name: 'Refuge Saint-Roch', siret: '12345678900012', address: '12 Rue de l’Espérance, 34000 Montpellier' },
    { name: 'L’Ami Fidèle', siret: '12345678900013', address: '5 Avenue des Animaux, 69000 Lyon' },
    { name: 'Solana Protection', siret: '12345678900014', address: '1 bis Rue du Chat, 33000 Bordeaux' },
    { name: 'Le Repaire des Griffes', siret: '12345678900015', address: '10 Chemin de la Ferme, 59000 Lille' }
  ];

  for (const item of shelterData) {
    const s = await prisma.pfcUser.create({
      data: {
        email: `contact@${item.name.toLowerCase().replace(/\s/g, '-')}.fr`,
        password: 'password123',
        role: UserRole.shelter,
        phoneNumber: '0102030405',
        // Utilise l'adresse définie dans le tableau ci-dessus
        address: item.address, 
        shelterProfile: {
          create: {
            siret: item.siret,
            shelterName: item.name,
            description: `Bienvenue chez ${item.name}, nous sauvons des animaux depuis 10 ans.`
          }
        }
      }
    });
    shelters.push(s);
  }

  // --- 3. CRÉATION DE 5 FAMILLES (INDIVIDUALS) ---
  for (let i = 1; i <= 5; i++) {
    await prisma.pfcUser.create({
      data: {
        email: `famille.${i}@email.com`,
        password: 'password123',
        role: UserRole.individual,
        phoneNumber: `060000000${i}`,
        address: `${i} rue des Animaux, 75000 Paris`,
        individualProfile: {
          create: {
            housingType: i % 2 === 0 ? HousingType.apartment : HousingType.house,
            surface: 40 + (i * 10),
            haveGarden: i % 2 !== 0,
            haveAnimals: i > 2,
            haveChildren: i === 1 || i === 5,
            availableFamily: true,
            availableTime: "Disponible le soir et les week-ends pour de longues balades."
          }
        }
      }
    });
  }


  // --- 3.5. CRÉATION D'UN COMPTE ADMIN ---
  //ajout de commentaire pour trigger pr
  console.log('👑 Création du compte administrateur...');
  await prisma.pfcUser.create({
    data: {
      email: 'admin@pfc.fr',
      password: 'admin-password', // À hacher avec bcrypt plus tard
      role: UserRole.admin,
      phoneNumber: '0100000000',
      address: 'Siège Pet Foster Connect, Paris',
      // Note : L'admin n'a pas besoin de shelterProfile ni d'individualProfile
    }
  });

  // --- 4. CRÉATION DE 25 ANIMAUX (5 par refuge) ---
  const animalNames = [
    'Boby', 'Luna', 'Filou', 'Rex', 'Mimi', 
    'Oscar', 'Bella', 'Simba', 'Nala', 'Rocky',
    'Zoe', 'Max', 'Daisy', 'Jack', 'Lola',
    'Pluto', 'Maya', 'Titi', 'Gribouille', 'Cookie',
    'Caramel', 'Nitro', 'Shadow', 'Praline', 'Pixel'
  ];

  const medicalNotes = [
    "Vaccins à jour. Traitement préventif contre les puces.",
    "Nécessite un nettoyage régulier des oreilles.",
    "Sous traitement léger pour les articulations.",
    "Régime alimentaire spécifique (croquettes médicalisées).",
    "Stérilisation prévue prochainement."
  ];

  let animalIndex = 0;
  for (const shelter of shelters) {
    for (let i = 0; i < 5; i++) {
      const currentName = animalNames[animalIndex % animalNames.length];
      const species = speciesList[animalIndex % speciesList.length];
      const keyword = species.name.toLowerCase() === 'chien' ? 'dog' : 'cat';

      // On génère 4 photos totalement uniques en utilisant l'animalIndex
      // Multiplier par 4 garantit qu'aucun animal ne partage d'ID d'image avec un autre
      const photos = [
        `https://loremflickr.com/600/600/${keyword}?lock=${(animalIndex * 4) + 1}`,
        `https://loremflickr.com/600/600/${keyword}?lock=${(animalIndex * 4) + 2}`,
        `https://loremflickr.com/600/600/${keyword}?lock=${(animalIndex * 4) + 3}`,
        `https://loremflickr.com/600/600/${keyword}?lock=${(animalIndex * 4) + 4}`
      ];

      await prisma.animal.create({
        data: {
          name: currentName,
          age: `${Math.floor(Math.random() * 8) + 1} ans`,
          sex: i % 2 === 0 ? AnimalSex.male : AnimalSex.female,
          weight: species.name === 'Chien' ? 18.5 : 4.2,
          height: species.name === 'Chien' ? 55 : 28,
          description: `Voici ${currentName}, un adorable compagnon en attente d'une famille.`,
          animalStatus: AnimalStatus.available,
          photos: photos, // Enregistre le tableau de 4 photos
          speciesId: species.id,
          pfcUserId: shelter.id,
          acceptOtherAnimals: true,
          acceptChildren: true,
          needGarden: species.name === 'Chien'
        }
      });
      animalIndex++;
    }
  }

  console.log('✅ Succès : 5 refuges, 5 familles et 25 animaux créés !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });