import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const email = "toto@gmail.com";
  const plainPassword = "toto";

  // Hash du mot de passe
  const hashedPassword = await argon2.hash(plainPassword);

  const user = await prisma.pfcUser.create({
    data: {
      email,
      password: hashedPassword,
      role: "individual",
    },
  });

  console.log("Utilisateur créé:", user);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
