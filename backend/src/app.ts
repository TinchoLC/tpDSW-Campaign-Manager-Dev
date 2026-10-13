import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(errorMiddleware); // siempre al final, después de todas las rutas

export default app;