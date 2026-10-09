// Clase base: toda excepción de negocio hereda de acá
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 — el recurso pedido no existe (o fue dado de baja lógica)
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}

// 403 — el usuario está logueado, pero no tiene permiso sobre ESTE recurso puntual
// (ej: no es el dueño del personaje, no es el DM de esa campaña)
export class ForbiddenError extends AppError {
  constructor(message = "No tenés permiso para realizar esta acción") {
    super(message, 403);
  }
}

// 409 — conflicto de datos (ej: nombre de usuario repetido, unique constraint)
export class ConflictError extends AppError {
  constructor(message = "Conflicto con el estado actual del recurso") {
    super(message, 409);
  }
}

// 400 — el body/params que mandó el cliente no son válidos
export class BadRequestError extends AppError {
  constructor(message = "Solicitud inválida") {
    super(message, 400);
  }
}

//401
export class UnauthorizedError extends AppError {
  constructor(message = "No autenticado") {
    super(message, 401);
  }
}