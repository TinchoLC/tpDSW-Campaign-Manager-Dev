// Extiende el tipo Request de Express para que TypeScript conozca "req.user", que en runtime lo agrega el middleware de autenticación (auth.middleware.ts)

export interface AuthUser {
  id: number;
  // agregar  otros campos que se guarden en el JWT
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export {};