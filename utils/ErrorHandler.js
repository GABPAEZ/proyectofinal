//para pasar los status code a los errores porque solo puedo pasar un argumento a next

export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}


