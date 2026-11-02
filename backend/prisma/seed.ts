import process from "node:process";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de la base de datos...");

  // Limpieza previa en orden para respetar claves foraneas
  await prisma.fichaMapa.deleteMany();
  await prisma.personajeCampanaObjeto.deleteMany();
  await prisma.personajeObjeto.deleteMany();
  await prisma.personajeCampana.deleteMany();
  await prisma.mapa.deleteMany();
  await prisma.personaje.deleteMany();
  await prisma.accion.deleteMany();
  await prisma.rasgo.deleteMany();
  await prisma.objeto.deleteMany();
  await prisma.catObjeto.deleteMany();
  await prisma.campana.deleteMany();
  await prisma.usuario.deleteMany();

  // 1. Usuarios
  console.log("Creando usuarios...");
  await prisma.usuario.create({
    data: {
    "id": 1,
    "nombre": "admin",
    "contrasena": "$2b$10$Zg/qR.GFz8BQJn5Cs5DvxOVbdNHBhRz.rLVQzgcu0bi5oC.CiZrNi",
    "tipo": "admin",
    "activo": true,
    "imagenUrl": null
}
  });
  await prisma.usuario.create({
    data: {
    "id": 2,
    "nombre": "martin",
    "contrasena": "$2b$10$dZWA3b6GKHSjVPWQ5P123.rLaLUPsqVG0BHvRCLTW8gwXvU3IwRL.",
    "tipo": null,
    "activo": true,
    "imagenUrl": null
}
  });
  await prisma.usuario.create({
    data: {
    "id": 3,
    "nombre": "nicolas",
    "contrasena": "$2b$10$zHKVIXbrxXIa/sYcyEjYruKqj72J8PGdmBg1Hd7K8eVC6DAhIIF.O",
    "tipo": null,
    "activo": true,
    "imagenUrl": null
}
  });
  await prisma.usuario.create({
    data: {
    "id": 4,
    "nombre": "agustin",
    "contrasena": "$2b$10$fIFoFZx/ScaCnsDoy57SpeE2BB4Lj1w7DUR9Cco6pK0qjJoYH1A/y",
    "tipo": null,
    "activo": true,
    "imagenUrl": null
}
  });

  // 2. Rasgos globales
  console.log("Creando rasgos globales...");
  await prisma.rasgo.create({
    data: {
    "id": 1,
    "nombre": "Intrépido",
    "descripcion": "Falta casi total de miedo ante el peligro, la adversidad o lo desconocido.",
    "visibleAJugador": true,
    "nivelMinimo": 6,
    "activo": true,
    "campanaId": null
}
  });

  // 3. Campanas
  console.log("Creando campanas...");
  await prisma.campana.create({
    data: {
    "id": 1,
    "nombre": "El abismo del caos mundial",
    "descripcion": "Todo empieza en una taberna y hay un abismo y caos mundial",
    "imagenUrl": "/uploads/test-images/campana_abismo.jpg",
    "estado": "activa",
    "activo": true,
    "usuarioId": 2
}
  });
  await prisma.campana.create({
    data: {
    "id": 2,
    "nombre": "Campaña de prueba",
    "descripcion": "incompleta",
    "imagenUrl": null,
    "estado": "planificada",
    "activo": true,
    "usuarioId": 4
}
  });

  // 4. Rasgos de campana
  console.log("Creando rasgos de campana...");
  await prisma.rasgo.create({
    data: {
    "id": 2,
    "nombre": "Aura corrupta",
    "descripcion": "El abismo consumió su alma",
    "visibleAJugador": true,
    "nivelMinimo": 1,
    "activo": true,
    "campanaId": 1
}
  });

  // 5. Mapas
  console.log("Creando mapas...");
  await prisma.mapa.create({
    data: {
    "id": 1,
    "nombre": "Taberna",
    "descripcion": null,
    "estado": "en_juego",
    "imagenUrl": "/uploads/test-images/mapa_taberna.jpg",
    "columnas": 7,
    "filas": 5,
    "activo": true,
    "campanaId": 1
}
  });
  await prisma.mapa.create({
    data: {
    "id": 2,
    "nombre": "Abismo",
    "descripcion": "No caer en el centro",
    "estado": "preparado",
    "imagenUrl": "/uploads/test-images/mapa_abismo.jpg",
    "columnas": 25,
    "filas": 25,
    "activo": true,
    "campanaId": 1
}
  });

  // 6. Personajes y NPCs
  console.log("Creando personajes y NPCs...");
  await prisma.personaje.create({
    data: {
    "id": 1,
    "tipo": "no_jugable",
    "nombre": "Skullomania",
    "descripcion": "Un esqueleto de pocas pulgas",
    "especie": "Esqueleto",
    "armadura": "2",
    "iniciativa": 2,
    "velocidad": 20,
    "vidaMax": 2,
    "vidaActual": null,
    "activo": true,
    "imagenUrl": "/uploads/test-images/skullomania.jpg",
    "fuerza": 2,
    "destreza": 2,
    "constitucion": 2,
    "inteligencia": 13,
    "carisma": 2,
    "sabiduria": 1,
    "clase": null,
    "nivel": 1,
    "manaMax": null,
    "experiencia": null,
    "oro": null,
    "estadoAgresion": "hostil",
    "campanaId": 1,
    "usuarioId": 2,
    "rasgos": {
        "connect": [
            {
                "id": 2
            }
        ]
    }
}
  });
  await prisma.personaje.create({
    data: {
    "id": 2,
    "tipo": "no_jugable",
    "nombre": "Tabernero Jorge",
    "descripcion": "Un tabernero muy sabio",
    "especie": "enano",
    "armadura": "1",
    "iniciativa": 1,
    "velocidad": 1,
    "vidaMax": 1,
    "vidaActual": null,
    "activo": true,
    "imagenUrl": "/uploads/test-images/tabernero_jorge.jpg",
    "fuerza": 1,
    "destreza": 1,
    "constitucion": 1,
    "inteligencia": 1,
    "carisma": 1,
    "sabiduria": 1,
    "clase": null,
    "nivel": 1,
    "manaMax": null,
    "experiencia": null,
    "oro": null,
    "estadoAgresion": "amistoso",
    "campanaId": 1,
    "usuarioId": 2
}
  });
  await prisma.personaje.create({
    data: {
    "id": 3,
    "tipo": "no_jugable",
    "nombre": "George \"El empresario\"",
    "descripcion": "Es un goblin empresarial",
    "especie": "Goblin",
    "armadura": "1",
    "iniciativa": 1,
    "velocidad": 1,
    "vidaMax": 1,
    "vidaActual": null,
    "activo": true,
    "imagenUrl": "/uploads/test-images/george_empresario.jpg",
    "fuerza": 1,
    "destreza": 1,
    "constitucion": 1,
    "inteligencia": 1,
    "carisma": 1,
    "sabiduria": 1,
    "clase": null,
    "nivel": 1,
    "manaMax": null,
    "experiencia": null,
    "oro": null,
    "estadoAgresion": "neutral",
    "campanaId": 1,
    "usuarioId": 2
}
  });
  await prisma.personaje.create({
    data: {
    "id": 4,
    "tipo": "jugable",
    "nombre": "Maguisimo Tom",
    "descripcion": "Le falta un ojo",
    "especie": "Humano",
    "armadura": "2",
    "iniciativa": 2,
    "velocidad": 2,
    "vidaMax": 50,
    "vidaActual": null,
    "activo": true,
    "imagenUrl": "/uploads/test-images/maguisimo_tom.jpg",
    "fuerza": 2,
    "destreza": 2,
    "constitucion": 2,
    "inteligencia": 2,
    "carisma": 2,
    "sabiduria": 2,
    "clase": "1",
    "nivel": 20,
    "manaMax": 50,
    "experiencia": 2,
    "oro": 2,
    "estadoAgresion": null,
    "campanaId": null,
    "usuarioId": 3
}
  });
  await prisma.personaje.create({
    data: {
    "id": 5,
    "tipo": "jugable",
    "nombre": "Sara la poderosa",
    "descripcion": "Chica muy poderosa",
    "especie": "Humana?",
    "armadura": "1",
    "iniciativa": 1,
    "velocidad": 1,
    "vidaMax": 1,
    "vidaActual": null,
    "activo": true,
    "imagenUrl": "/uploads/test-images/sara_poderosa.jpg",
    "fuerza": 1,
    "destreza": 1,
    "constitucion": 1,
    "inteligencia": 1,
    "carisma": 1,
    "sabiduria": 1,
    "clase": "q",
    "nivel": 1,
    "manaMax": 1,
    "experiencia": 1,
    "oro": 1,
    "estadoAgresion": null,
    "campanaId": null,
    "usuarioId": 4
}
  });

  // 7. Participantes (PersonajeCampana)
  console.log("Creando participantes en campana...");
  await prisma.personajeCampana.create({
    data: {
    "id": 1,
    "nombre": "Maguisimo Tom",
    "armadura": "2",
    "iniciativa": 2,
    "velocidad": 2,
    "vidaMax": 50,
    "vidaActual": 50,
    "nivel": 20,
    "oro": 2,
    "experiencia": 2,
    "clase": "1",
    "manaMax": 50,
    "manaActual": 50,
    "fuerza": 2,
    "destreza": 2,
    "constitucion": 2,
    "sabiduria": 2,
    "carisma": 2,
    "inteligencia": 2,
    "activo": true,
    "estado": "vivo",
    "personajeId": 4,
    "campanaId": 1,
    "rasgos": {
        "connect": [
            {
                "id": 1
            }
        ]
    }
}
  });
  await prisma.personajeCampana.create({
    data: {
    "id": 2,
    "nombre": "Sara la poderosa",
    "armadura": "1",
    "iniciativa": 1,
    "velocidad": 1,
    "vidaMax": 1,
    "vidaActual": 1,
    "nivel": 1,
    "oro": 1,
    "experiencia": 1,
    "clase": "q",
    "manaMax": 1,
    "manaActual": 1,
    "fuerza": 1,
    "destreza": 1,
    "constitucion": 1,
    "sabiduria": 1,
    "carisma": 1,
    "inteligencia": 1,
    "activo": true,
    "estado": "vivo",
    "personajeId": 5,
    "campanaId": 1
}
  });

  // 8. Fichas de Mapa
  console.log("Creando fichas de mapa...");
  await prisma.fichaMapa.create({
    data: {
    "id": 4,
    "posicionX": 14,
    "posicionY": 4,
    "estado": null,
    "mapaId": 2,
    "personajeId": 1,
    "personajeCampanaId": null
}
  });
  await prisma.fichaMapa.create({
    data: {
    "id": 5,
    "posicionX": 1,
    "posicionY": 2,
    "estado": null,
    "mapaId": 1,
    "personajeId": 3,
    "personajeCampanaId": null
}
  });
  await prisma.fichaMapa.create({
    data: {
    "id": 6,
    "posicionX": 3,
    "posicionY": 4,
    "estado": null,
    "mapaId": 1,
    "personajeId": null,
    "personajeCampanaId": 2
}
  });
  await prisma.fichaMapa.create({
    data: {
    "id": 7,
    "posicionX": 4,
    "posicionY": 4,
    "estado": null,
    "mapaId": 1,
    "personajeId": null,
    "personajeCampanaId": 1
}
  });
  await prisma.fichaMapa.create({
    data: {
    "id": 8,
    "posicionX": 3,
    "posicionY": 0,
    "estado": null,
    "mapaId": 1,
    "personajeId": 2,
    "personajeCampanaId": null
}
  });

  console.log("Seed completado exitosamente.");
}

main()
  .catch((err) => {
    console.error("Error ejecutando el seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
