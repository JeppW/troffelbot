class ContextError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ContextError';
    }
}