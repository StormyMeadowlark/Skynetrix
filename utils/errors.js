class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.errors = errors; // This could hold specific validation error details
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

// Add other custom error classes as needed

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
};
