import { z } from "zod";
export const estadoAgresionEnum = z.enum(["hostil", "neutral", "amistoso"]);