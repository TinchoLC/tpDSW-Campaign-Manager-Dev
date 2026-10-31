import express from "express"; // Importamos express para crear la aplicación y manejar las rutas y middlewares
import cors from "cors"; /// CORS: permite que el frontend (que está en otra dirección) pueda pedirle datos al backend
import path from "path"; // Path: ayuda a armar rutas de carpetas que funcionen en cualquier sistema (Windows, Mac, Linux)
import swaggerUi from "swagger-ui-express"; // Muestra la documentación de la API como una página web interactiva, permitiendo a los desarrolladores explorar y probar los endpoints de la API directamente desde el navegador
import { swaggerSpec } from "./config/swagger"; // El contenido de esa documentación (qué rutas hay, qué datos piden y qué responden)
import routes from "./routes"; // Importamos las rutas principales de la aplicación, que agrupan los endpoints de los diferentes módulos (usuarios, personajes, campañas, etc.) bajo un prefijo común (/api)
import { errorMiddleware } from "./middlewares/error.middleware"; // Atrapa los errores y le responde al usuario con un mensaje claro, sin que el servidor se caiga

const app = express(); //creamos el servidor

app.use(express.json()); //convierte el cuerpo JSON de cada petición en un objeto JavaScript accesible a través de req.body
app.use(cors()); //permite que el frontend se conecte al backend desde otro dominio, evitando problemas de seguridad relacionados con el intercambio de recursos entre diferentes orígenes
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads"))); //sirve archivos estáticos desde la carpeta public/uploads, permitiendo que las imágenes subidas sean accesibles públicamente a través de URLs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); //sirve la documentación de la API generada por Swagger en la ruta /api-docs, proporcionando una interfaz interactiva para explorar y probar los endpoints de la API
app.use("/api", routes); //define la ruta base /api para todas las rutas de la aplicación, agrupando los endpoints bajo un prefijo común
app.use(errorMiddleware); // siempre al final, después de todas las rutas

export default app;