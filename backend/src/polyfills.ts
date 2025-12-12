// Polyfills для Node.js v18+
// Це має бути імпортовано перед будь-якими іншими модулями

// Додаємо crypto в globalThis для використання в NestJS Schedule
const cryptoModule = require('crypto');
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = cryptoModule.webcrypto || cryptoModule;
}
// Також додаємо в глобальний об'єкт для застарілих модулів
if (typeof (global as any).crypto === 'undefined') {
  (global as any).crypto = cryptoModule.webcrypto || cryptoModule;
}

export {};

