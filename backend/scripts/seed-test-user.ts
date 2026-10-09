import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/hash.ts";

async function main() {
  const contrasenaHasheada = await hashPassword("password123");

  const usuario = await prisma.usuario.upsert({
    where: { nombre: "usuarioPrueba" },
    update: {},
    create: {
      nombre: "usuarioPrueba",
      contrasena: contrasenaHasheada,
    },
  });

  console.log("Usuario de prueba listo:", usuario);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());