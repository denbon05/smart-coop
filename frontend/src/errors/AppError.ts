class AppError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export default AppError;
