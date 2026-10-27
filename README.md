# Campaign Manager TTRPG - DSW

## Integrantes
* 52285 - Gregoret, Agustín
* 53742 - Bolzico, Nicolás
* 53952 - Cabrera, Martín Leonel

## Requisitos previos
* Node.js (v20 o superior recomendado)
* Servidor MySQL

## Configuración de variables de entorno
Copiar los archivos `.env.example` a `.env` y completar las variables en ambos:

1. **Backend**: crear `backend/.env` a partir de `backend/.env.example`.
2. **Frontend**: crear `frontend/.env` a partir de `frontend/.env.example`.

## Iniciar proyecto

Instalar todas las dependencias del proyecto (en raíz):
```bash
npm install
```

Preparar la base de datos (Prisma):
```bash
npm run prisma:generate -w backend
npm run prisma:migrate -w backend
```

Ejecutar backend y frontend en simultáneo con concurrently:
```bash
npm run dev
```

Ejecutar de forma individual:
* Backend: `npm run dev:backend`
* Frontend: `npm run dev:frontend`