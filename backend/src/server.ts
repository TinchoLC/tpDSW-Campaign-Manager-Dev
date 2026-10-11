import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.warn("\n[AVISO DE CONFIGURACIÓN]");
  console.warn("Faltan variables de entorno esenciales para el funcionamiento del backend.");
  console.warn("Por favor creá tu archivo .env en la carpeta backend tomando como base '.env.example'.");
}

app.listen(PORT, () => {
  console.log(`\n[INICIO DEL SERVIDOR]`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});