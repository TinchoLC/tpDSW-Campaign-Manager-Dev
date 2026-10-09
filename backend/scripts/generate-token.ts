import jwt from "jsonwebtoken";
import "dotenv/config";

const usuarioId = Number(process.argv[2]);

if (!usuarioId) {
  console.error("Uso: pnpm exec tsx scripts/generate-token.ts <usuarioId>");
  process.exit(1);
}

const token = jwt.sign({ id: usuarioId }, process.env.JWT_SECRET as string, {
  expiresIn: "1d",
});
console.log(token);