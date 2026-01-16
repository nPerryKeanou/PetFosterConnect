import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Créer le refuge
  const shelter = await prisma.pfcUser.create({
    data: {
      email: 'refuge@test.com',
      password: 'hash_bidon_123', // OBLIGATOIRE
      role: 'shelter',
      shelter_profile: {
        create: {
          siret: '12345678901234',
          shelter_name: 'Refuge Test',
        },
      },
    },
  });

  // Créer le candidat
  const candidate = await prisma.pfcUser.create({
    data: {
      email: 'candidat@test.com',
      password: 'hash_bidon_123', // OBLIGATOIRE
      role: 'individual',
      individual_profile: {
        create: {
          have_garden: true,
        },
      },
    },
  });

  // Créer l'espèce
  const species = await prisma.species.create({
    data: { name: 'Chien' },
  });

  // Créer l'animal
  const animal = await prisma.animal.create({
    data: {
      name: 'Rex',
      species_id: species.id,
      pfc_user_id: shelter.id,
      sex: 'male',
      animal_status: 'available',
    },
  });

  console.log({ shelter, candidate, species, animal });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());