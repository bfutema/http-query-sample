class AppError {
  public readonly message: string;

  public readonly code: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400, code = 'error') {
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
  }
}

export { AppError };
